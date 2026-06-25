import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Введите корректный email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password: string;

  @IsString()
  @MinLength(1, { message: 'Введите имя' })
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}