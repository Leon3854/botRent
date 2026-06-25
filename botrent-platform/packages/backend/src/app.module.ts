import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BotsModule } from './bots/bots.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsModule } from './payments/payments.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { TelegramModule } from './telegram/telegram.module';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ConfigModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    BotsModule,
    SubscriptionsModule,
    PaymentsModule,
    WebhooksModule,
    TelegramModule,
    LeadsModule,
  ],
})
export class AppModule {}