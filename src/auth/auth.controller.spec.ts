import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    register: jest.fn().mockResolvedValue({ userId: 1, email: 'a@b.com' }),
    login: jest.fn().mockResolvedValue({ accessToken: 'jwt' }),
  } as Partial<AuthService> as AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();
    controller = moduleRef.get(AuthController);
  });

  it('register delegates to service', async () => {
    const res = await controller.register({ email: 'a@b.com', password: 'x' });
    expect(authService.register).toHaveBeenCalledWith('a@b.com', 'x');
    expect(res).toEqual({ userId: 1, email: 'a@b.com' });
  });

  it('login delegates to service', async () => {
    const res = await controller.login({ email: 'a@b.com', password: 'x' });
    expect(authService.login).toHaveBeenCalledWith('a@b.com', 'x');
    expect(res).toEqual({ accessToken: 'jwt' });
  });

  it('me returns current user from decorator parameter', () => {
    const user = { userId: 42, email: 'u@e' };
    expect(controller.me(user)).toBe(user);
  });
});
