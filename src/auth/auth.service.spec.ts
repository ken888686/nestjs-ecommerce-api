import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    userByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('test_token'),
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    passwordHash: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    roleId: 3,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token and user info on successful login', async () => {
      mockUsersService.userByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('test@example.com', 'password');

      expect(result).toEqual({
        accessToken: 'test_token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          roleId: mockUser.roleId,
        },
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        roleId: mockUser.roleId,
      });
    });

    it('should throw UnauthorizedException on invalid password', async () => {
      mockUsersService.userByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.userByEmail.mockResolvedValue(null);

      await expect(
        service.login('notfound@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signup', () => {
    it('should create a new user and return result without passwordHash', async () => {
      const signupData = {
        email: 'new@example.com',
        password: 'password',
        firstName: 'New',
        lastName: 'User',
      };

      const createdUser = {
        ...mockUser,
        email: signupData.email,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
      };

      mockUsersService.createUser.mockResolvedValue(createdUser);

      const result = await service.signup(signupData);

      expect(result).toEqual(
        expect.objectContaining({
          email: signupData.email,
          firstName: signupData.firstName,
          lastName: signupData.lastName,
        }),
      );
      expect(result).not.toHaveProperty('passwordHash');
      expect(mockUsersService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: signupData.email,
          passwordHash: 'hashedPassword',
        }),
      );
    });
  });
});
