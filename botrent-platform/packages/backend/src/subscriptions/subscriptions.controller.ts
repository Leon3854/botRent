import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class SubscriptionsController {
  constructor(
    private subscriptionsService: SubscriptionsService,
    private prisma: PrismaService,
  ) {}

  @Get('plans')
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscriptions')
  createSubscription(@Req() req, @Body() dto: { planId: number }) {
    return this.subscriptionsService.createSubscription(req.user.id, dto.planId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('subscriptions/active')
  async getActiveSubscription(@Req() req) {
    return this.subscriptionsService.getActiveSubscription(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscriptions/activate-test')
  async activateTest(@Req() req) {
    const pending = await this.prisma.subscription.findFirst({
      where: { userId: req.user.id, status: 'pending' },
      orderBy: { createdAt: 'desc' },
    });
    if (!pending) {
      const active = await this.prisma.subscription.findFirst({
        where: { userId: req.user.id, status: 'active' },
      });
      if (active) return active;
      throw new Error('No pending subscription');
    }
    return this.subscriptionsService.activateSubscription(pending.id);
  }
}
