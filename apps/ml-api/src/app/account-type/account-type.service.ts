import { Inject, Injectable } from '@nestjs/common';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { UpdateAccountTypeDto } from './dto/update-account-type.dto';
import { ACCOUNT_TYPE_REPOSITORY } from '../constants';
import { AccountType } from './entities/account-type.entity';
import { QueryException } from '../error/common.exception';
import { AccountTypes } from './dto/account-types';

@Injectable()
export class AccountTypeService {
    constructor(@Inject(ACCOUNT_TYPE_REPOSITORY) private readonly accountTypeRepository: typeof AccountType) {}

    create(createAccountTypeDto: CreateAccountTypeDto) {
        return this.accountTypeRepository.create(createAccountTypeDto);
    }

    findAll() {
        return this.accountTypeRepository.findAll();
    }

    findOne(id: string) {
        return this.accountTypeRepository.findOne({ where: { id } });
    }

    findByType(type: string): Promise<AccountType> {
        return this.accountTypeRepository.findOne({ where: { type: type } });
    }

    update(id: string, updateAccountTypeDto: UpdateAccountTypeDto) {
        return this.accountTypeRepository.update(updateAccountTypeDto, { where: { id } });
    }

    remove(id: string) {
        return this.accountTypeRepository.destroy({ where: { id } });
    }

    async seedDefaultData(): Promise<void> {
        try {
            for (const type in AccountTypes) {
                const accountType = AccountTypes[type];
                await this.accountTypeRepository.upsert({ id: accountType, type: accountType });
            }
        } catch (error) {
            throw new QueryException(QueryException.save());
        }
    }
}
