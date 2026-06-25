import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller()
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  // GET /api/plans
  @Get('plans')
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  // POST /api/subscriptions
  @UseGuards(JwtAuthGuard)
  @Post('subscriptions')
  async createSubscription(@Req() req, @Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.createSubscription(req.user.id, dto.planId);
  }

  // GET /api/subscriptions/active
  @UseGuards(JwtAuthGuard)
  @Get('subscriptions/active')
  async getActiveSubscription(@Req() req) {
    return this.subscriptionsService.getActiveSubscription(req.user.id);
  }

  // POST /api/subscriptions/cancel
  @UseGuards(JwtAuthGuard)
  @Post('subscriptions/cancel')
  async cancelSubscription(@Req() req) {
    return this.subscriptionsService.cancelSubscription(req.user.id);
  }
}