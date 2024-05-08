import { Test, TestingModule } from '@nestjs/testing';
import { UserDeviceLinkService } from './user-device-link.service';

describe.skip('DeviceServiceLink', () => {
    let service: UserDeviceLinkService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserDeviceLinkService],
        }).compile();

        service = module.get<UserDeviceLinkService>(UserDeviceLinkService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
