import { Controller, Post, Body, Headers, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from '../payments/payments.service';
import { TelegramService } from '../telegram/telegram.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private configService: ConfigService,
    private paymentsService: PaymentsService,
    private telegramService: TelegramService,
  ) {}

  // POST /api/webhooks/yookassa
  @Post('yookassa')
  @HttpCode(HttpStatus.OK)
  async handleYookassaWebhook(@Body() body: any, @Headers() headers: any) {
    // В продакшене нужно проверять подпись вебхука
    // Для тестового режима пропускаем проверку
    
    const { event, object } = body;

    if (!event || !object) {
      throw new BadRequestException('Неверный формат вебхука');
    }

    // Обрабатываем успешный платёж
    if (event === 'payment.succeeded') {
      try {
        const payment = await this.paymentsService.updatePaymentStatus(
          object.id,
          'succeeded',
        );

        // Отправляем уведомление админу в Telegram
        await this.telegramService.sendPaymentNotification(
          payment.id,
          payment.amount,
          payment.subscriptionId,
        );

        console.log(`✅ Платёж ${object.id} успешно обработан`);
      } catch (error) {
        console.error(`❌ Ошибка обработки платежа: ${error.message}`);
        throw new BadRequestException('Ошибка обработки платежа');
      }
    } else if (event === 'payment.canceled') {
      try {
        await this.paymentsService.updatePaymentStatus(object.id, 'cancelled');
        console.log(`ℹ️ Платёж ${object.id} отменён`);
      } catch (error) {
        console.error(`❌ Ошибка обработки отмены платежа: ${error.message}`);
      }
    }

    return { status: 'ok' };
  }
}