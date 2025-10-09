import { Test } from '@nestjs/testing';
import { DiseasesController } from './diseases.controller';
import { DiseasesService } from './diseases.service';

describe('DiseasesController', () => {
  let controller: DiseasesController;
  const diseasesService = {
    create: jest.fn().mockResolvedValue({ id: 'd1' }),
    findAll: jest.fn().mockResolvedValue([{ id: 'd1' }]),
    findOne: jest.fn().mockResolvedValue({ id: 'd1' }),
  } as Partial<DiseasesService> as DiseasesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [DiseasesController],
      providers: [{ provide: DiseasesService, useValue: diseasesService }],
    }).compile();
    controller = moduleRef.get(DiseasesController);
  });

  it('create delegates to service with current user', async () => {
    const res = await controller.create({ userId: 1 }, { name: 'Flu' } as any);
    expect(diseasesService.create).toHaveBeenCalledWith(1, { name: 'Flu' });
    expect(res).toEqual({ id: 'd1' });
  });

  it('list delegates to service', async () => {
    const res = await controller.list({ userId: 1 });
    expect(diseasesService.findAll).toHaveBeenCalledWith(1);
    expect(res).toEqual([{ id: 'd1' }]);
  });

  it('get delegates to service', async () => {
    const res = await controller.get({ userId: 1 }, 'd1');
    expect(diseasesService.findOne).toHaveBeenCalledWith(1, 'd1');
    expect(res).toEqual({ id: 'd1' });
  });
});
