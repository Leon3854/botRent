import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Безопасность
  app.use(helmet.default());

  // CORS
  app.enableCors({
    origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Глобальная валидация
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Увеличение лимита для вебхуков
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  // Глобальный префикс API
  app.setGlobalPrefix('api');

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 BotRent Backend запущен на порту ${port}`);
  console.log(`📅 Время запуска: ${new Date().toISOString()}`);
}

bootstrap();