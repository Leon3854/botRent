import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { PaymentsModule } from '../payments/payments.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [PaymentsModule, TelegramModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}