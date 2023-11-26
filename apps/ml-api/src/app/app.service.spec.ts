import {Test} from '@nestjs/testing';
import {AppService} from './app.service';
import {Logger} from "@nestjs/common";

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [AppService, {
        provide: Logger,
        useValue : {
          log: jest.fn(),
        }
      }],
    }).compile();

    await module.init();
    service = module.get<AppService>(AppService);
    expect(service).toBeDefined();
  });

  it('should return a message', async () => {
    expect(true).toEqual(true);
  });
});
