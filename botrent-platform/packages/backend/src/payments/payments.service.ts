import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async createPayment(userId: number, planId: number) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');

    const subscription = await this.subscriptionsService.createSubscription(userId, planId);

    // TEST MODE: activate immediately without real payment
    const payment = await this.prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: plan.price,
        status: 'succeeded',
        yookassaId: 'demo_' + Date.now(),
        paidAt: new Date(),
      },
    });

    await this.subscriptionsService.activateSubscription(subscription.id);

    return {
      payment_id: payment.id,
      confirmation_url: `/success?payment_id=${payment.id}`,
    };
  }

  async getPaymentStatus(paymentId: number) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundException('Payment not found');
    return { id: payment.id, status: payment.status, amount: payment.amount, paidAt: payment.paidAt };
  }

  async getUserPayments(userId: number) {
    const subs = await this.prisma.subscription.findMany({ where: { userId }, select: { id: true } });
    return this.prisma.payment.findMany({
      where: { subscriptionId: { in: subs.map(s => s.id) } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updatePaymentStatus(yookassaId: string, status: string) {
    const payment = await this.prisma.payment.findFirst({ where: { yookassaId }, include: { subscription: true } });
    if (!payment) throw new NotFoundException('Payment not found');
    return this.prisma.payment.update({
      where: { id: payment.id },
      data: { status, paidAt: status === 'succeeded' ? new Date() : null },
    });
  }
}
