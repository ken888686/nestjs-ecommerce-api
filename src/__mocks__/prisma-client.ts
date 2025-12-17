// Mock Prisma Client for Jest tests
export const Prisma = {
  UserWhereUniqueInput: {},
  UserWhereInput: {},
  UserOrderByWithRelationInput: {},
  UserCreateInput: {},
  UserUpdateInput: {},
};

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  roleId: number;
}

export interface Role {
  id: number;
  name: string;
}

export class PrismaClient {
  user = {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  $connect = jest.fn();
  $disconnect = jest.fn();
}
