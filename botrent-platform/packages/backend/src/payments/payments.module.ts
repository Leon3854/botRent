import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { YookassaService } from './yookassa.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [SubscriptionsModule],
  providers: [PaymentsService, YookassaService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}