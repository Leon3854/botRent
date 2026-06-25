import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateBotDto {
  @IsString()
  @IsNotEmpty({ message: 'Название бота обязательно' })
  name: string;

  @IsString()
  @IsIn(['booking', 'quiz', 'catalog', 'notifications'], {
    message: 'Неверный тип бота',
  })
  type: string;

  @IsString()
  @IsNotEmpty({ message: 'Токен бота обязателен' })
  botToken: string;

  @IsString()
  @IsNotEmpty({ message: 'Username бота обязателен' })
  botUsername: string;

  @IsOptional()
  settings?: any;
}