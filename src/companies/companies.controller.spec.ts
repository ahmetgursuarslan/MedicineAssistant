import { Test } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  const companiesService = {
    create: jest.fn().mockResolvedValue({ id: 'c1' }),
    findAll: jest.fn().mockResolvedValue([{ id: 'c1' }]),
    findOne: jest.fn().mockResolvedValue({ id: 'c1' }),
  } as Partial<CompaniesService> as CompaniesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [{ provide: CompaniesService, useValue: companiesService }],
    }).compile();
    controller = moduleRef.get(CompaniesController);
  });

  it('create delegates to service with current user', async () => {
    const res = await controller.create({ userId: 99 }, { name: 'ACME' } as any);
    expect(companiesService.create).toHaveBeenCalledWith(99, { name: 'ACME' });
    expect(res).toEqual({ id: 'c1' });
  });

  it('list delegates to service', async () => {
    const res = await controller.list();
    expect(companiesService.findAll).toHaveBeenCalled();
    expect(res).toEqual([{ id: 'c1' }]);
  });

  it('get delegates to service with id', async () => {
    const res = await controller.get('c1');
    expect(companiesService.findOne).toHaveBeenCalledWith('c1');
    expect(res).toEqual({ id: 'c1' });
  });
});
