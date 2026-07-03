import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwt = {
    signAsync: jest.fn().mockResolvedValue('test-token'),
  };

  const mockConfig = {
    get: jest.fn((key: string) => {
      if (key === 'jwt.secret') return 'test-secret';
      if (key === 'jwt.refreshSecret') return 'test-refresh';
      if (key === 'RECAPTCHA_SECRET_KEY') return 'test';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should register new user', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({ id: 1, email: 'test@test.com' });

    const result = await service.register({
      email: 'test@test.com',
      password: '12345678',
      firstName: 'Test',
      recaptchaToken: 'test',
    });

    expect(result).toEqual({ message: 'Registration successful', userId: 1 });
  });

  it('should throw if user exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });

    await expect(
      service.register({
        email: 'test@test.com',
        password: '12345678',
        firstName: 'Test',
        recaptchaToken: 'test',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should login with valid credentials', async () => {
    const hash = await bcrypt.hash('12345678', 10);
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 1, email: 'test@test.com', passwordHash: hash,
      isActive: true, role: 'client',
    });

    const result = await service.login({ email: 'test@test.com', password: '12345678' });
    expect(result).toHaveProperty('access_token');
  });
});
