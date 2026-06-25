import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { YookassaService } from './yookassa.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private subscriptionsService: SubscriptionsService,
    private yookassaService: YookassaService,
  ) {}

  // Создание платежа
  async createPayment(userId: number, planId: number) {
    // Получаем тариф
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Тариф не найден');
    }

    // Создаём подписку
    const subscription = await this.subscriptionsService.createSubscription(userId, planId);

    // Создаём платёж в ЮKassa
    const siteUrl = this.configService.get<string>('site.url');
    const returnUrl = `${siteUrl}/success`;

    const yookassaPayment = await this.yookassaService.createPayment(
      plan.price * 100, // Конвертируем в копейки
      `Оплата тарифа «${plan.name}» — BotRent`,
      returnUrl,
    );

    // Сохраняем платёж в БД
    const payment = await this.prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: plan.price,
        status: 'pending',
        yookassaId: yookassaPayment.payment_id,
      },
    });

    return {
      payment_id: payment.id,
      confirmation_url: yookassaPayment.confirmation_url,
    };
  }

  // Получить статус платежа
  async getPaymentStatus(paymentId: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Платёж не найден');
    }

    return {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      paidAt: payment.paidAt,
    };
  }

  // Получить платежи пользователя
  async getUserPayments(userId: number) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { userId },
      select: { id: true },
    });

    const subscriptionIds = subscriptions.map(s => s.id);

    return this.prisma.payment.findMany({
      where: {
        subscriptionId: { in: subscriptionIds },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Обновить статус платежа (для вебхуков)
  async updatePaymentStatus(yookassaId: string, status: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { yookassaId },
      include: {
        subscription: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Платёж не найден');
    }

    // Обновляем статус платежа
    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status,
        paidAt: status === 'succeeded' ? new Date() : null,
      },
    });

    // Если платёж успешен, активируем подписку
    if (status === 'succeeded') {
      await this.subscriptionsService.activateSubscription(payment.subscriptionId);
    }

    return updatedPayment;
  }
}