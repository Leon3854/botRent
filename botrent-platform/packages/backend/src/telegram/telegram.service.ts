import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  private readonly botToken: string;
  private readonly adminId: string;

  constructor(private configService: ConfigService) {
    this.botToken = this.configService.get<string>('telegram.botToken');
    this.adminId = this.configService.get<string>('telegram.adminId');
  }

  // Отправка уведомления о новом платеже
  async sendPaymentNotification(paymentId: number, amount: number, subscriptionId: number) {
    if (!this.botToken || !this.adminId) {
      console.warn('⚠️ Telegram уведомления не настроены (отсутствует BOT_TOKEN или ADMIN_TELEGRAM_ID)');
      return;
    }

    const message = [
      `💰 <b>Новая оплата!</b>`,
      ``,
      `📋 Номер платежа: <code>#${paymentId}</code>`,
      `💵 Сумма: <b>${amount.toLocaleString()} ₽</b>`,
      `🆔 Подписка: <code>#${subscriptionId}</code>`,
      `📅 Дата: ${new Date().toLocaleString('ru-RU')}`,
    ].join('\n');

    try {
      await this.sendMessage(this.adminId, message);
      console.log(`✅ Уведомление о платеже #${paymentId} отправлено в Telegram`);
    } catch (error) {
      console.error(`❌ Ошибка отправки уведомления в Telegram: ${error.message}`);
    }
  }

  // Отправка сообщения в Telegram
  async sendMessage(chatId: string, text: string) {
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ошибка Telegram API: ${errorData.description}`);
    }

    return response.json();
  }
}