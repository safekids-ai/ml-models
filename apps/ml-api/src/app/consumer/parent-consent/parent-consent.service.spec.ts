import { Test, TestingModule } from '@nestjs/testing';
import { ParentConsentService } from './parent-consent.service';
import { LoggingService } from '../../logger/logging.service';

class Fixture {
    static getMock() {
        return jest.fn();
    }

    static PARENT_CONSENT_REPOSITORY = class {
        static create = Fixture.getMock();
    };

    static getLoggingService() {
        return {
            className: Fixture.getMock(),
            debug: Fixture.getMock(),
            error: Fixture.getMock(),
        };
    }
}

describe('Parent consent service unit tests', () => {
    let service: ParentConsentService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ParentConsentService,
                {
                    provide: 'PARENT_CONSENT_REPOSITORY',
                    useValue: Fixture.PARENT_CONSENT_REPOSITORY,
                },
                {
                    provide: LoggingService,
                    useValue: Fixture.getLoggingService(),
                },
            ],
        }).compile();

        service = module.get<ParentConsentService>(ParentConsentService);
    });

    describe('Create parent consent', () => {
        it('Should create parent consent successfully', async () => {
            //given
            const userId = 'userId';
            const accountId = 'accountId';

            const userCodeDTO = {
                hasLegalAuthorityToInstall: true,
                boundByPrivacyPolicy: true,
                userId,
                accountId,
            };

            //when
            await service.create(userId, accountId, userCodeDTO);

            //then
            expect(Fixture.PARENT_CONSENT_REPOSITORY.create).toHaveBeenCalledTimes(1);
            expect(Fixture.PARENT_CONSENT_REPOSITORY.create).toHaveBeenCalledWith(userCodeDTO);
        });
    });
});
