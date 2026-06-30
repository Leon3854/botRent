import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly refreshTokens: Map<string, string> = new Map();
  private readonly loginAttempts: Map<string, number> = new Map();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async verifyRecaptcha(token: string): Promise<boolean> {
    const secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
    if (!secretKey || secretKey === 'test') {
      return true;
    }
    try {
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`,
      });
      const data = await response.json();
      return data.success && data.score >= 0.5;
    } catch {
      return false;
    }
  }

  async register(dto: RegisterDto) {
    const isValid = await this.verifyRecaptcha(dto.recaptchaToken);
    if (!isValid) {
      throw new BadRequestException('Captcha verification failed');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    if (dto.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName?.trim(),
      },
    });

    return { message: 'Registration successful', userId: user.id };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    
    const attempts = this.loginAttempts.get(email) || 0;
    if (attempts >= 5) {
      throw new BadRequestException('Too many login attempts. Try again in 15 minutes.');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      this.loginAttempts.set(email, attempts + 1);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      this.loginAttempts.set(email, attempts + 1);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.loginAttempts.delete(email);
    return this.generateTokens(user.id, user.email, user.role);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      if (this.refreshTokens.has(`blacklist_${refreshToken}`)) {
        throw new UnauthorizedException('Token revoked');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found');
      }

      this.refreshTokens.set(`blacklist_${refreshToken}`, '1');
      return this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async logout(refreshToken: string) {
    this.refreshTokens.set(`blacklist_${refreshToken}`, '1');
    return { message: 'Logged out' };
  }

  private async generateTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: '7d',
      }),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }
}
