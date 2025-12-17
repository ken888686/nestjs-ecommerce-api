import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  const mockHealthCheckService = {
    check: jest.fn().mockResolvedValue({ status: 'ok' }),
  };

  const mockHttpHealthIndicator = {
    pingCheck: jest.fn().mockResolvedValue({ 'nestjs-docs': { status: 'up' } }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: HttpHealthIndicator, useValue: mockHttpHealthIndicator },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health check result', async () => {
    const result = await controller.check();
    expect(result).toEqual({ status: 'ok' });
    expect(mockHealthCheckService.check).toHaveBeenCalled();
  });
});
