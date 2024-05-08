import { Injectable } from '@nestjs/common';
import { FilteredUrlService } from '../filtered-url/filtered-url.service';
import { FilteredCategoryService } from '../filtered-category/filtered-category.service';
import { CalendarService } from '../calendar/calendar.service';
import { InterceptionTimeService } from '../interception-time/interception-time.service';
import { UserService } from '../user/user.service';
import { CreateFeedbackDto } from '../feedback/dto/create-feedback.dto';
import { FeedbackService } from '../feedback/feedback.service';
import { CreateWebTimeDto } from '../web-time/dto/create-web-time.dto';
import { WebTimeService } from '../web-time/web-time.service';
import { NonSchoolDaysConfigService } from '../non-school-days-config/non-school-days-config.service';
import { AccountService } from '../accounts/account.service';

@Injectable()
export class ChromeService {
    constructor(
        private readonly filteredUrlsService: FilteredUrlService,
        private readonly filteredCategoryService: FilteredCategoryService,
        private readonly calendarService: CalendarService,
        private readonly interceptionTimeService: InterceptionTimeService,
        private readonly accountService: AccountService,
        private readonly userService: UserService,
        private readonly webTimeService: WebTimeService,
        private readonly feedbackService: FeedbackService,
        private readonly nonSchoolDaysConfigService: NonSchoolDaysConfigService
    ) {}

    async getWebFilterConfiguration(accountId: string, userId: string, orgUnitId: string) {
        const urls: any = await this.filteredUrlsService.findAllTypeUrls(accountId, userId);
        const filteredCategories = await this.filteredCategoryService.findAllByAccountAndUserId(accountId, userId, orgUnitId);
        urls.filteredCategories = filteredCategories.map((o) => o.categoryId);
        const account = await this.accountService.findOne(accountId);
        const interceptionCategories = account.interceptionCategories;
        urls.interceptionCategories = interceptionCategories;
        return urls;
    }

    async checkHoliday(accountId, date: string) {
        const time = Date.parse(date);
        const givenDate = new Date(time);
        let result = await this.calendarService.checkHoliday(accountId, givenDate);
        const nonSchoolDayConfig = await this.nonSchoolDaysConfigService.findByAccountId(accountId);
        if (!result && nonSchoolDayConfig && nonSchoolDayConfig.weekendsEnabled && (givenDate.getDay() === 6 || givenDate.getDay() === 0)) {
            result = true;
        }
        return { holiday: result };
    }

    async getInterceptTimes(accountId) {
        return await this.interceptionTimeService.findByAccountId(accountId);
    }

    async updateAccessLimit(userId: string, limitaccess: boolean) {
        await this.userService.limitAccess(userId, limitaccess);
    }

    async isAccessLimited(accountId: string, userId: string) {
        const user = await this.userService.findOneByAccountId(accountId, userId);
        const access = user && user.accessLimited;
        return { accessLimited: access };
    }

    async saveFeedback(accountId, deviceLinkId, feedback: CreateFeedbackDto) {
        feedback.userDeviceLinkId = deviceLinkId;
        feedback.accountId = accountId;
        return await this.feedbackService.create(feedback);
    }

    async saveWebTime(webTime: CreateWebTimeDto) {
        const user = await this.userService.findOneById(webTime.userId);
        webTime.userId = user.id;
        webTime.userEmail = user.email;
        webTime.orgUnitId = user.orgUnitId;
        await this.webTimeService.create(webTime);
    }

    async findTeachers(accountId) {
        return await this.userService.findTeachersForAccount(accountId);
    }

    async findParents(accountId) {
        return await this.userService.findParentAccount(accountId);
    }
}
