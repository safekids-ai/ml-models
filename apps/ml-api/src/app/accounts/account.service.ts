import { Inject, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ACCOUNT_REPOSITORY } from '../constants';
import { Account } from './entities/account.entity';
import { StatusService } from '../status/status.service';
import { QueryException } from '../error/common.exception';
import { LoggingService } from '../logger/logging.service';
import { QueryTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AccountService {
    constructor(
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: typeof Account,
        private readonly statusService: StatusService,
        private readonly log: LoggingService
    ) {}
    async create(createAccountDto: CreateAccountDto): Promise<Account> {
        createAccountDto.id = uuidv4();
        return this.accountRepository.create(createAccountDto);
    }

    findAll(options = {}): Promise<Account[]> {
        if (options) {
            return this.accountRepository.findAll(options);
        }
        return this.accountRepository.findAll();
    }

    findOne(id: string): Promise<Account> {
        return this.accountRepository.findOne({ where: { id: id } });
    }

    findOneByDomain(primaryDomain: string): Promise<Account> {
        return this.accountRepository.findOne({ where: { primaryDomain } });
    }

    async findAdminAccount(primaryDomain: string) {
        const query =
            ' select ' +
            ' a.id,' +
            ' a.primary_domain ' +
            ' from ' +
            ' user u ' +
            ' inner join account a on ' +
            ' u.account_id = a.id ' +
            ' and u.is_admin = true ' +
            " and a.onboarding_status_id = 'COMPLETED' " +
            ' inner join auth_token token on ' +
            ' u.id = token.user_id ' +
            ' where ' +
            ' ((a.primary_domain = :primaryDomain) OR ' +
            " (POSITION(CONCAT('.',a.primary_domain) IN :primaryDomain) > 0 and a.account_type_id = 'SCHOOL') ) " +
            ' limit 1 ';

        const adminAccount = await this.accountRepository.sequelize.query(query, {
            replacements: { primaryDomain },
            type: QueryTypes.SELECT,
            mapToModel: true,
            model: Account,
        });

        if (adminAccount[0] == undefined) {
            return null;
        }
        return adminAccount[0];
    }

    async upsertByDomain(dto: CreateAccountDto): Promise<Account> {
        try {
            const found = await this.findOneByDomain(dto.primaryDomain);
            if (found) {
                await this.accountRepository.update(dto, {
                    where: { primaryDomain: dto.primaryDomain },
                });
            } else {
                dto.id = uuidv4();
                await this.accountRepository.create(dto);
            }
            return await this.findOneByDomain(dto.primaryDomain);
        } catch (e) {
            this.log.error(QueryException.upsert(e));
            throw new QueryException(QueryException.upsert());
        }
    }

    async getAccountType(id: string): Promise<{ accountType: string }> {
        const account: Account = await this.accountRepository.findOne({
            attributes: ['accountTypeId'],
            where: { id },
        });
        return { accountType: account.accountTypeId };
    }

    async getEmergencyContact(id: string) {
        return await this.accountRepository.findOne({
            attributes: ['emergencyContactName', 'emergencyContactPhone'],
            where: { id },
        });
    }

    async saveEmergencyContact(id: string, updateDTO: UpdateAccountDto) {
        const { emergencyContactName, emergencyContactPhone } = updateDTO;
        await this.accountRepository.update({ emergencyContactName, emergencyContactPhone }, { where: { id } });
    }

    async saveInterceptionCategories(id: string, updateAccountDto: UpdateAccountDto) {
        let interceptionCategories: string[] = updateAccountDto.interceptionCategories;
        try {
            if (interceptionCategories && interceptionCategories.length > 0) {
                interceptionCategories = interceptionCategories.map((element: any) => {
                    return element.toUpperCase();
                });
            }
        } catch (e) {
            console.error('Failed to capitalize list of categories. ${e}');
        }
        await this.accountRepository.update({ interceptionCategories: interceptionCategories }, { where: { id: id } });
    }

    async getInterceptionCategories(id: string) {
        return await this.accountRepository.findOne({
            attributes: ['interceptionCategories'],
            where: { id },
        });
    }

    async getOnBoardingStatus(accountId) {
        const account = await this.findOne(accountId);
        return {
            onBoardingStep: account.onBoardingStep,
            onBoardingStatus: account.onBoardingStatusId,
        };
    }

    async updateOnBoardingStatus(accountId, updateAccountDto: UpdateAccountDto) {
        const status = await this.statusService.findByStatus(updateAccountDto.onBoardingStatus);
        //if(!status) throw Exception()
        await this.accountRepository.update({ onBoardingStatusId: status.id }, { where: { id: accountId } });
    }

    async updateOnBoardingStep(accountId, updateAccountDto: UpdateAccountDto) {
        await this.accountRepository.update({ onBoardingStep: updateAccountDto.onBoardingStep }, { where: { id: accountId } });
    }

    async update(id: string, objToUpDate = {}): Promise<void> {
        await this.accountRepository.update(objToUpDate, { where: { id: id } });
    }

    async findByCustomerId(stripeCustomerId: string) {
        return await this.accountRepository.findOne({
            attributes: ['id'],
            where: { stripeCustomerId },
        });
    }
}
