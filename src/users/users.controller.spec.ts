import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

// Mock UsersService
const mockUsersService = {
  user: jest.fn(),
  users: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

jest.mock('./users.service', () => ({
  UsersService: jest.fn().mockImplementation(() => mockUsersService),
}));

import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    passwordHash: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    isActive: true,
    createdAt: new Date(),
    updatedAt: null,
    roleId: 3,
    role: { id: 3, name: 'Customer' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signupUser', () => {
    it('should create a new user', async () => {
      mockUsersService.createUser.mockResolvedValue(mockUser);

      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await controller.signupUser(createUserDto);

      expect(result.email).toBe('test@example.com');
      expect(result.id).toBe(1);
      // passwordHash should not be exposed
      expect((result as any).passwordHash).toBeUndefined();
      expect(service.createUser).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      mockUsersService.user.mockResolvedValue(mockUser);

      const result = await controller.getUserById('1');

      expect(result.id).toBe(1);
      expect(result.email).toBe('test@example.com');
      expect(service.user).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.user.mockResolvedValue(null);

      await expect(controller.getUserById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      mockUsersService.users.mockResolvedValue([mockUser]);

      const result = await controller.getUsers('0', '10');

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe('test@example.com');
      expect(service.users).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle undefined pagination params', async () => {
      mockUsersService.users.mockResolvedValue([mockUser]);

      await controller.getUsers(undefined, undefined);

      expect(service.users).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updatedUser = { ...mockUser, firstName: 'Updated' };
      mockUsersService.user.mockResolvedValue(mockUser);
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser('1', { firstName: 'Updated' });

      expect(result.firstName).toBe('Updated');
      expect(service.updateUser).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { firstName: 'Updated' },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.user.mockResolvedValue(null);

      await expect(
        controller.updateUser('999', { firstName: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockUsersService.user.mockResolvedValue(mockUser);
      mockUsersService.deleteUser.mockResolvedValue(mockUser);

      await expect(controller.deleteUser('1')).resolves.toBeUndefined();
      expect(service.deleteUser).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.user.mockResolvedValue(null);

      await expect(controller.deleteUser('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
