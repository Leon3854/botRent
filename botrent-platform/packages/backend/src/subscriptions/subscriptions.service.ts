import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  // Получить все тарифы
  async getPlans() {
    return this.prisma.plan.findMany({
      where: { isActive: true },
    });
  }

  // Создать подписку
  async createSubscription(userId: number, planId: number) {
    // Проверяем существование тарифа
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      throw new NotFoundException('Тариф не найден');
    }

    // Проверяем, нет ли уже активной подписки
    const activeSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
    });

    if (activeSubscription) {
      throw new BadRequestException('У вас уже есть активная подписка');
    }

    // Создаём подписку со статусом pending
    return this.prisma.subscription.create({
      data: {
        userId,
        planId,
        status: 'pending',
        startDate: new Date(),
      },
      include: {
        plan: true,
      },
    });
  }

  // Получить активную подписку пользователя
  async getActiveSubscription(userId: number) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
      include: {
        plan: true,
        bots: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Активная подписка не найдена');
    }

    return subscription;
  }

  // Отменить подписку
  async cancelSubscription(userId: number) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
    });

    if (!subscription) {
      throw new NotFoundException('Активная подписка не найдена');
    }

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'cancelled',
        endDate: new Date(),
      },
    });
  }

  // Активировать подписку
  async activateSubscription(subscriptionId: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Подписка не найдена');
    }

    // Устанавливаем дату окончания (+30 дней)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'active',
        endDate,
      },
      include: {
        plan: true,
        user: true,
      },
    });
  }
}