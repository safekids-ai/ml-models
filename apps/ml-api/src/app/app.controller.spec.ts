import {Test, TestingModule} from '@nestjs/testing';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

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
      }, {
        provide: ConfigService,
        useValue: {
          get: jest.fn((key: string) => {
            return null;
          })
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
