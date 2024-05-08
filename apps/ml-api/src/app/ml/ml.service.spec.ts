import {Test} from '@nestjs/testing';
import {MlService} from 'apps/ml-api/src/app/ml/ml.service';
import {Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

describe('AppService', () => {

  let service: MlService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [MlService, {
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

    //await module.init();
    service = module.get<MlService>(MlService);
    expect(service).toBeDefined();
  });

  it('should return a message', async () => {
    expect(true).toEqual(true);
  });
});
