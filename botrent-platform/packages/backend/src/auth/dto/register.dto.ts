import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsNotEmpty()
  password: string;

  @IsString()
  @MinLength(1, { message: 'Name is required' })
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  recaptchaToken?: string;
}
