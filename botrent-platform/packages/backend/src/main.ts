import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Безопасность
  app.use(helmet.default());

  // CORS — разрешаем все localhost порты
  app.enableCors({
    origin: function (origin, callback) {
      // Разрешаем запросы без origin (curl, Postman) и с localhost
      if (!origin || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Глобальная валидация
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Увеличение лимита limit: '1mb' }));

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
