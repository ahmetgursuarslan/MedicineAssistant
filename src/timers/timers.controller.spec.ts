import { Test } from '@nestjs/testing';
import { TimersController } from './timers.controller';
import { TimersService } from './timers.service';

describe('TimersController', () => {
  let controller: TimersController;
  const timersService = {
    create: jest.fn().mockResolvedValue({ id: 't1' }),
    list: jest.fn().mockResolvedValue([{ id: 't1' }]),
    get: jest.fn().mockResolvedValue({ id: 't1' }),
  } as Partial<TimersService> as TimersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TimersController],
      providers: [{ provide: TimersService, useValue: timersService }],
    }).compile();
    controller = moduleRef.get(TimersController);
  });

  it('create delegates to service with current user', async () => {
    const res = await controller.create({ userId: 1 }, { name: 'Timer' } as any);
    expect(timersService.create).toHaveBeenCalledWith(1, { name: 'Timer' });
    expect(res).toEqual({ id: 't1' });
  });

  it('list delegates to service', async () => {
    const res = await controller.list({ userId: 1 });
    expect(timersService.list).toHaveBeenCalledWith(1);
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('get delegates to service', async () => {
    const res = await controller.get({ userId: 1 }, 't1');
    expect(timersService.get).toHaveBeenCalledWith(1, 't1');
    expect(res).toEqual({ id: 't1' });
  });
});
