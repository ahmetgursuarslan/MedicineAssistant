import { Test } from '@nestjs/testing';
import { RiskController } from './risk.controller';
import { RiskService } from './risk.service';

describe('RiskController', () => {
  let controller: RiskController;
  const riskService = {
    analyze: jest.fn().mockResolvedValue({ risk: 'low' }),
  } as Partial<RiskService> as RiskService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RiskController],
      providers: [{ provide: RiskService, useValue: riskService }],
    }).compile();
    controller = moduleRef.get(RiskController);
  });

  it('analyze delegates to service with current user and id', async () => {
    const res = await controller.analyze({ userId: 7 }, 'm1');
    expect(riskService.analyze).toHaveBeenCalledWith(7, 'm1');
    expect(res).toEqual({ risk: 'low' });
  });
});
