import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Получить пользователя по ID
  async getUserById(userId: number, currentUserId: number, currentUserRole: string) {
    // Проверяем права доступа (только свой профиль или админ)
    if (userId !== currentUserId && currentUserRole !== 'admin') {
      throw new ForbiddenException('Доступ запрещён');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        telegramId: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  // Обновить профиль пользователя
  async updateUser(userId: number, currentUserId: number, currentUserRole: string, data: any) {
    if (userId !== currentUserId && currentUserRole !== 'admin') {
      throw new ForbiddenException('Доступ запрещён');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const allowedFields = ['firstName', 'lastName', 'phone', 'telegramId'];
    const updateData = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        telegramId: true,
      },
    });
  }
}