import { Test } from '@nestjs/testing';
import { AllergensController } from './allergens.controller';
import { AllergensService } from './allergens.service';

describe('AllergensController', () => {
  let controller: AllergensController;
  const allergensService = {
    create: jest.fn().mockResolvedValue({ id: 'a1' }),
    findAll: jest.fn().mockResolvedValue([{ id: 'a1' }]),
    findOne: jest.fn().mockResolvedValue({ id: 'a1' }),
  } as Partial<AllergensService> as AllergensService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AllergensController],
      providers: [{ provide: AllergensService, useValue: allergensService }],
    }).compile();
    controller = moduleRef.get(AllergensController);
  });

  it('create delegates to service with current user', async () => {
    const res = await controller.create({ userId: 1 }, { name: 'Pollen' } as any);
    expect(allergensService.create).toHaveBeenCalledWith(1, { name: 'Pollen' });
    expect(res).toEqual({ id: 'a1' });
  });

  it('list delegates to service', async () => {
    const res = await controller.list({ userId: 1 });
    expect(allergensService.findAll).toHaveBeenCalledWith(1);
    expect(res).toEqual([{ id: 'a1' }]);
  });

  it('get delegates to service', async () => {
    const res = await controller.get({ userId: 1 }, 'a1');
    expect(allergensService.findOne).toHaveBeenCalledWith(1, 'a1');
    expect(res).toEqual({ id: 'a1' });
  });
});
