import { Test, TestingModule } from '@nestjs/testing';
import { emailEventProviders } from './email-event.providers';
import { EmailEventService } from './email-event.service';
import { LoggingService } from '../logger/logging.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { UserCodeService } from '../consumer/user-code/user-code.service';
import { FilteredCategoryService } from '../filtered-category/filtered-category.service';
import { EmailEventConfig } from '../email-event-config/entities/email-event-config.entity';
import { EmailEventConfigService } from '../email-event-config/email-event-config.service';
import { UserService } from '../user/user.service';

class Fixture {
    static getMock() {
        return jest.fn();
    }

    static getConfigService = class {
        static _isDevelopment = Fixture.getMock().mockReturnValue(true);
        static get = Fixture.getMock().mockReturnValue({ gmailExtension: {} });
    };

    static getUserService = class {
        static limitAccess = Fixture.getMock();
        static findOneByAccountId = Fixture.getMock();
        static findOneById = Fixture.getMock();
        static findParentsForAccount = Fixture.getMock();
        static findUserByAccessCode = Fixture.getMock();
    };

    static getEmailService = class {
        static sendEmail = Fixture.getMock();
    };

    static getEmailEventConfigService = class {
        static findOneByAccountIdByEvent = Fixture.getMock();
    };
}
describe('EmailEventService', () => {
    let service: EmailEventService;
    const mockLoggingService = {
        className: jest.fn(),
        error: jest.fn().mockReturnValue('error occured'),
        debug: jest.fn(),
        info: jest.fn(),
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailEventService,
                ...emailEventProviders,
                {
                    provide: LoggingService,
                    useValue: mockLoggingService,
                },
                {
                    provide: ConfigService,
                    useValue: Fixture.getConfigService,
                },
                {
                    provide: EmailService,
                    useValue: Fixture.getEmailService,
                },
                {
                    provide: UserService,
                    useValue: Fixture.getUserService,
                },
                {
                    provide: EmailEventConfigService,
                    useValue: Fixture.getEmailEventConfigService,
                },
            ],
        }).compile();

        service = module.get<EmailEventService>(EmailEventService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
