import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roleId: 3,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should register a new user', async () => {
      const dto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password',
        firstName: 'New',
        lastName: 'User',
      };

      mockAuthService.signup.mockResolvedValue(mockUser);

      const result = await controller.signup(dto);

      expect(result).toEqual({
        message: 'User registered successfully',
        user: mockUser,
      });
      expect(mockAuthService.signup).toHaveBeenCalledWith({
        email: dto.email,
        password: dto.password,
        firstName: dto.firstName,
        lastName: dto.lastName,
      });
    });
  });

  describe('login', () => {
    it('should login user and return token', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const loginResult = {
        accessToken: 'token',
        user: mockUser,
      };

      mockAuthService.login.mockResolvedValue(loginResult);

      const result = await controller.login(dto);

      expect(result).toEqual(loginResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
    });
  });
});
