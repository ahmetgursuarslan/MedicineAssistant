import { Test } from '@nestjs/testing';
import { MedicinesController } from './medicines.controller';
import { MedicinesService } from './medicines.service';

describe('MedicinesController', () => {
  let controller: MedicinesController;
  const medsService = {
    create: jest.fn().mockResolvedValue({ id: 'm1' }),
    list: jest.fn().mockResolvedValue([{ id: 'm1' }]),
    get: jest.fn().mockResolvedValue({ id: 'm1' }),
    addProspectus: jest.fn().mockResolvedValue({ ok: true }),
    listProspectus: jest.fn().mockResolvedValue([{ id: 'p1' }]),
  } as Partial<MedicinesService> as MedicinesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MedicinesController],
      providers: [{ provide: MedicinesService, useValue: medsService }],
    }).compile();
    controller = moduleRef.get(MedicinesController);
  });

  it('create delegates to service with current user', async () => {
    const res = await controller.create({ userId: 1 }, { name: 'Med' } as any);
    expect(medsService.create).toHaveBeenCalledWith(1, { name: 'Med' });
    expect(res).toEqual({ id: 'm1' });
  });

  it('list delegates to service', async () => {
    const res = await controller.list();
    expect(medsService.list).toHaveBeenCalled();
    expect(res).toEqual([{ id: 'm1' }]);
  });

  it('get delegates to service', async () => {
    const res = await controller.get('m1');
    expect(medsService.get).toHaveBeenCalledWith('m1');
    expect(res).toEqual({ id: 'm1' });
  });

  it('addProspectus delegates to service with current user', async () => {
    const res = await controller.addProspectus({ userId: 1 }, { medicineId: 'm1', text: 't' } as any);
    expect(medsService.addProspectus).toHaveBeenCalledWith(1, { medicineId: 'm1', text: 't' });
    expect(res).toEqual({ ok: true });
  });

  it('listProspectus delegates to service with id', async () => {
    const res = await controller.listProspectus('m1');
    expect(medsService.listProspectus).toHaveBeenCalledWith('m1');
    expect(res).toEqual([{ id: 'p1' }]);
  });
});
