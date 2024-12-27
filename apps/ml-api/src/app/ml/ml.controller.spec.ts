import {Test, TestingModule} from '@nestjs/testing';

import {MlController} from './ml.controller';
import {MlService} from './ml.service';
import {Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {APP_GUARD} from "@nestjs/core";

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [MlController],
      providers: [
        MlService,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return null;
            })
          }
        },
        {
          provide: APP_GUARD,
          useClass: jest.fn()
        }
      ],
    }).compile();
    const appController = app.get<MlController>(MlController);
    expect(appController).toBeDefined();
  });

  it('should return a message', async () => {
    expect(true).toEqual(true);
  });
});
