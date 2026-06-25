import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class YookassaService {
  private readonly shopId: string;
  private readonly secretKey: string;
  private readonly apiUrl: string;

  constructor(private configService: ConfigService) {
    this.shopId = this.configService.get<string>('yookassa.shopId');
    this.secretKey = this.configService.get<string>('yookassa.secretKey');
    this.apiUrl = this.configService.get<string>('yookassa.apiUrl');
  }

  // Создание платежа в ЮKassa
  async createPayment(amount: number, description: string, returnUrl: string) {
    const auth = Buffer.from(`${this.shopId}:${this.secretKey}`).toString('base64');

    const body = {
      amount: {
        value: (amount / 100).toFixed(2),
        currency: 'RUB',
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: returnUrl,
      },
      description,
    };

    try {
      const response = await fetch(`${this.apiUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
          'Idempotence-Key': this.generateIdempotenceKey(),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new BadRequestException(
          `Ошибка создания платежа: ${errorData.description || 'Неизвестная ошибка'}`,
        );
      }

      const payment = await response.json();
      return {
        payment_id: payment.id,
        confirmation_url: payment.confirmation.confirmation_url,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Ошибка соединения с платёжным сервисом');
    }
  }

  // Получение информации о платеже
  async getPaymentInfo(paymentId: string) {
    const auth = Buffer.from(`${this.shopId}:${this.secretKey}`).toString('base64');

    try {
      const response = await fetch(`${this.apiUrl}/payments/${paymentId}`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      if (!response.ok) {
        throw new BadRequestException('Ошибка получения информации о платеже');
      }

      return response.json();
    } catch (error) {
      throw new BadRequestException('Ошибка соединения с платёжным сервисом');
    }
  }

  // Генерация ключа идемпотентности
  private generateIdempotenceKey(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}