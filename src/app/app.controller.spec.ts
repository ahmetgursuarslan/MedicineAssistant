import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  it('should be defined', () => {
    expect(AppController).toBeDefined();
  });
});
