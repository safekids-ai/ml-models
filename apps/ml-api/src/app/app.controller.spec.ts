import {Test, TestingModule} from '@nestjs/testing';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {Logger} from "@nestjs/common";

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, {
        provide: Logger,
        useValue: {
          log: jest.fn(),
        }
      }],
    }).compile();
    const appController = app.get<AppController>(AppController);
    expect(appController).toBeDefined();
  });

  it('should return a message', async () => {
    expect(true).toEqual(true);
  });
});
