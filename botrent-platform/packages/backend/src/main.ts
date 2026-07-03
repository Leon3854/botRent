import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cookieParser());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.use(json({ limit: '10kb' }));
  app.use(urlencoded({ extended: true, limit: '10kb' }));
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  await app.listen(4000);
  console.log('🚀 BotRent Backend started on port 4000');
}
bootstrap();
