import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { AuthService } from './service';
import { prisma } from '../../config/database';

vi.mock('../../config/database', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService();
  });

  describe('register', () => {
    it('should successfully register a new user and return a JWT', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue({
        id: 'user-uuid-1',
        name: 'New Author',
        email: 'author@contentpilot.ai',
        password: 'hashed-password',
        role: 'EDITOR',
        createdAt: new Date('2026-09-24T12:00:00Z'),
        updatedAt: new Date('2026-09-24T12:00:00Z'),
      });

      const result = await authService.register({
        name: 'New Author',
        email: 'author@contentpilot.ai',
        password: 'Password123!',
        role: 'EDITOR',
      });

      expect(result).toHaveProperty('token');
      expect(result.user).toEqual({
        id: 'user-uuid-1',
        name: 'New Author',
        email: 'author@contentpilot.ai',
        role: 'EDITOR',
        createdAt: '2026-09-24T12:00:00.000Z',
        updatedAt: '2026-09-24T12:00:00.000Z',
      });
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should throw AppError with 409 if email already exists', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'existing-id',
        name: 'Existing',
        email: 'existing@contentpilot.ai',
        password: 'hashed',
        role: 'EDITOR',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        authService.register({
          name: 'Existing',
          email: 'existing@contentpilot.ai',
          password: 'Password123!',
          role: 'EDITOR',
        })
      ).rejects.toThrow('Email address is already in use');
    });
  });

  describe('login', () => {
    it('should successfully authenticate user with correct password', async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Secret123!', salt);

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user-uuid-1',
        name: 'Login User',
        email: 'login@contentpilot.ai',
        password: hashedPassword,
        role: 'EDITOR',
        createdAt: new Date('2026-09-24T12:00:00Z'),
        updatedAt: new Date('2026-09-24T12:00:00Z'),
      });

      const result = await authService.login({
        email: 'login@contentpilot.ai',
        password: 'Secret123!',
      });

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('login@contentpilot.ai');
    });

    it('should throw AppError with 401 if user not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'notfound@contentpilot.ai',
          password: 'AnyPassword',
        })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw AppError with 401 if password does not match', async () => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('CorrectPassword!', salt);

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user-uuid-1',
        name: 'Login User',
        email: 'login@contentpilot.ai',
        password: hashedPassword,
        role: 'EDITOR',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(
        authService.login({
          email: 'login@contentpilot.ai',
          password: 'WrongPassword!',
        })
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('getProfile', () => {
    it('should return user profile when found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 'user-uuid-1',
        name: 'Profile User',
        email: 'profile@contentpilot.ai',
        password: 'hashed',
        role: 'EDITOR',
        createdAt: new Date('2026-09-24T12:00:00Z'),
        updatedAt: new Date('2026-09-24T12:00:00Z'),
      });

      const profile = await authService.getProfile('user-uuid-1');
      expect(profile.name).toBe('Profile User');
      expect(profile).not.toHaveProperty('password');
    });

    it('should throw AppError with 404 if user not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(authService.getProfile('unknown-id')).rejects.toThrow('User profile not found');
    });
  });
});
