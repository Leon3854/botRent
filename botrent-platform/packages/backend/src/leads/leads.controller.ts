import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('leads')
export class LeadsController {
  constructor(private prisma: PrismaService) {}

  // POST /api/leads — создание заявки с лендинга
  @Post()
  async createLead(@Body() body: any) {
    const lead = await this.prisma.lead.create({
      data: {
        name: body.name,
        phone: body.phone,
        business: body.business,
        botType: body.botType || 'booking',
      },
    });

    return {
      message: 'Заявка успешно отправлена',
      leadId: lead.id,
    };
  }

  // GET /api/leads — список заявок (только для админа)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getLeads(@Req() req) {
    // Проверяем, что пользователь — админ
    if (req.user.role !== 'admin') {
      return [];
    }

    return this.prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}