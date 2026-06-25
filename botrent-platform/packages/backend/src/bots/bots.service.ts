import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBotDto } from './dto/create-bot.dto';

@Injectable()
export class BotsService {
  constructor(private prisma: PrismaService) {}

  // Создание бота
  async createBot(userId: number, dto: CreateBotDto) {
    // Проверяем активную подписку
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
      include: {
        plan: true,
        bots: true,
      },
    });

    if (!subscription) {
      throw new ForbiddenException('Для создания бота нужна активная подписка');
    }

    // Проверяем лимит ботов
    if (subscription.bots.length >= subscription.plan.maxBots) {
      throw new ForbiddenException(
        `Достигнут лимит ботов для тарифа "${subscription.plan.name}". Максимум: ${subscription.plan.maxBots}`,
      );
    }

    // Создаём бота
    return this.prisma.bot.create({
      data: {
        name: dto.name,
        type: dto.type,
        botToken: dto.botToken,
        botUsername: dto.botUsername.replace('@', ''),
        settings: dto.settings || {},
        userId,
        subscriptionId: subscription.id,
      },
    });
  }

  // Список ботов пользователя
  async getUserBots(userId: number) {
    return this.prisma.bot.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Детали бота
  async getBotById(userId: number, botId: number) {
    const bot = await this.prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      throw new NotFoundException('Бот не найден');
    }

    if (bot.userId !== userId) {
      throw new ForbiddenException('Доступ запрещён');
    }

    return bot;
  }

  // Обновление бота
  async updateBot(userId: number, botId: number, data: any) {
    const bot = await this.getBotById(userId, botId);

    const allowedFields = ['name', 'settings', 'botToken', 'botUsername'];
    const updateData = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    return this.prisma.bot.update({
      where: { id: botId },
      data: updateData,
    });
  }

  // Удаление бота
  async deleteBot(userId: number, botId: number) {
    await this.getBotById(userId, botId);

    return this.prisma.bot.delete({
      where: { id: botId },
    });
  }

  // Запуск бота
  async startBot(userId: number, botId: number) {
    await this.getBotById(userId, botId);

    return this.prisma.bot.update({
      where: { id: botId },
      data: { isActive: true },
    });
  }

  // Остановка бота
  async stopBot(userId: number, botId: number) {
    await this.getBotById(userId, botId);

    return this.prisma.bot.update({
      where: { id: botId },
      data: { isActive: false },
    });
  }
}