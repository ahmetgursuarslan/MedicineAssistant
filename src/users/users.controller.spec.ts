import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const usersService = {
    findMe: jest.fn().mockResolvedValue({ userId: 1 }),
    updateUser: jest.fn().mockResolvedValue({ userId: 1, name: 'X' }),
  } as Partial<UsersService> as UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();
    controller = moduleRef.get(UsersController);
  });

  it('me returns current user via service', async () => {
    const res = await controller.me({ userId: 1 });
    expect(usersService.findMe).toHaveBeenCalledWith(1);
    expect(res).toEqual({ userId: 1 });
  });

  it('update delegates to service with route param and body', async () => {
    const res = await controller.update({ userId: 1 }, '10', { name: 'X' } as any);
    expect(usersService.updateUser).toHaveBeenCalledWith({ userId: 1 }, '10', { name: 'X' });
    expect(res).toEqual({ userId: 1, name: 'X' });
  });
});
