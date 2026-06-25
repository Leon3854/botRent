import { IsNumber, IsPositive } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNumber()
  @IsPositive({ message: 'Укажите корректный ID тарифа' })
  planId: number;
}