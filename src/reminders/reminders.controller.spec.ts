import { Test } from '@nestjs/testing';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';

describe('RemindersController', () => {
  let controller: RemindersController;
  const remindersService = {
    list: jest.fn().mockResolvedValue([{ id: 1 }]),
    get: jest.fn().mockResolvedValue({ id: 1 }),
  } as Partial<RemindersService> as RemindersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RemindersController],
      providers: [{ provide: RemindersService, useValue: remindersService }],
    }).compile();
    controller = moduleRef.get(RemindersController);
  });

  it('list delegates to service with timerId', async () => {
    const res = await controller.list('10');
    expect(remindersService.list).toHaveBeenCalledWith('10');
    expect(res).toEqual([{ id: 1 }]);
  });

  it('get delegates to service with numeric id', async () => {
    const res = await controller.get('5');
    expect(remindersService.get).toHaveBeenCalledWith(5);
    expect(res).toEqual({ id: 1 });
  });
});
