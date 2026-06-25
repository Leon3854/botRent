import { Controller, Get, Patch, Param, Body, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /api/users/:id
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.usersService.getUserById(id, req.user.id, req.user.role);
  }

  // PATCH /api/users/:id
  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: any,
    @Req() req,
  ) {
    return this.usersService.updateUser(id, req.user.id, req.user.role, updateData);
  }
}