import { Controller, Post, Get, Body, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // POST /api/payments/create
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPayment(@Req() req, @Body('planId') planId: number) {
    return this.paymentsService.createPayment(req.user.id, planId);
  }

  // GET /api/payments/:id/status
  @Get(':id/status')
  async getPaymentStatus(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.getPaymentStatus(id);
  }

  // GET /api/payments
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserPayments(@Req() req) {
    return this.paymentsService.getUserPayments(req.user.id);
  }
}