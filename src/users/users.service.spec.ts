import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

// Create a mock PrismaService
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Mock the PrismaService module
jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => mockPrismaService),
}));

import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
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
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user', () => {
    it('should return a user by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.user({ id: 1 });

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { role: true },
      });
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.user({ id: 999 });

      expect(result).toBeNull();
    });
  });

  describe('userByEmail', () => {
    it('should return a user by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.userByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: { role: true },
      });
    });
  });

  describe('users', () => {
    it('should return an array of users', async () => {
      const mockUsers = [mockUser];
      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.users({ skip: 0, take: 10 });

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        cursor: undefined,
        where: undefined,
        orderBy: undefined,
        include: { role: true },
      });
    });

    it('should return empty array when no users exist', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await service.users({});

      expect(result).toEqual([]);
    });
  });

  describe('createUser', () => {
    const createUserData = {
      email: 'new@example.com',
      passwordHash: 'hashedPassword',
      firstName: 'Jane',
      lastName: 'Doe',
      role: { connect: { id: 3 } },
    };

    it('should create a new user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        ...mockUser,
        email: 'new@example.com',
      });

      const result = await service.createUser(createUserData);

      expect(result.email).toBe('new@example.com');
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserData,
        include: { role: true },
      });
    });

    it('should throw ConflictException if email exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.createUser(createUserData)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updatedUser = { ...mockUser, firstName: 'Updated' };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser({
        where: { id: 1 },
        data: { firstName: 'Updated' },
      });

      expect(result.firstName).toBe('Updated');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { firstName: 'Updated' },
        include: { role: true },
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.deleteUser({ id: 1 });

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
