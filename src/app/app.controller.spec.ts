import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  it('health returns ok', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    const controller = moduleRef.get(AppController);
    const res = controller.health();
    expect(res.status).toBe('ok');
  });
});
