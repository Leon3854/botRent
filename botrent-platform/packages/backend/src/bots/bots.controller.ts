import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BotsService } from './bots.service';
import { CreateBotDto } from './dto/create-bot.dto';

@Controller('bots')
@UseGuards(JwtAuthGuard)
export class BotsController {
  constructor(private botsService: BotsService) {}

  // POST /api/bots
  @Post()
  async createBot(@Req() req, @Body() dto: CreateBotDto) {
    return this.botsService.createBot(req.user.id, dto);
  }

  // GET /api/bots
  @Get()
  async getUserBots(@Req() req) {
    return this.botsService.getUserBots(req.user.id);
  }

  // GET /api/bots/:id
  @Get(':id')
  async getBotById(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.botsService.getBotById(req.user.id, id);
  }

  // PATCH /api/bots/:id
  @Patch(':id')
  async updateBot(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.botsService.updateBot(req.user.id, id, data);
  }

  // DELETE /api/bots/:id
  @Delete(':id')
  async deleteBot(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.botsService.deleteBot(req.user.id, id);
  }

  // POST /api/bots/:id/start
  @Post(':id/start')
  async startBot(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.botsService.startBot(req.user.id, id);
  }

  // POST /api/bots/:id/stop
  @Post(':id/stop')
  async stopBot(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.botsService.stopBot(req.user.id, id);
  }
}