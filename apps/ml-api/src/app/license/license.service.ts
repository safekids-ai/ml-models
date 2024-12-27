import { Inject, Injectable } from '@nestjs/common';
import { LICENSE_REPOSITORY } from '../constants';
import { License, LicenseCreationAttributes } from './entities/license.entity';
import { v4 as uuidv4 } from 'uuid';
import { QueryException } from '../error/common.exception';
import { defaultLicenses } from './default.license';

@Injectable()
export class LicenseService {
    constructor(@Inject(LICENSE_REPOSITORY) private readonly repository: typeof License) {}
    create(createLicenseDto: LicenseCreationAttributes) {
        if (!createLicenseDto.id) {
            createLicenseDto.id = uuidv4();
        }
        return this.repository.create(createLicenseDto);
    }

    findAll() {
        return this.repository.findAll();
    }

    findOne(id: string) {
        return this.repository.findOne({ where: { id } });
    }

    update(id: string, updateLicenseDto: Partial<LicenseCreationAttributes>) {
        return this.repository.update(updateLicenseDto, { where: { id } });
    }

    remove(id: string) {
        return this.repository.destroy({ where: { id } });
    }

    async seedDefaultData() {
        try {
            for (const license of defaultLicenses) {
                await this.repository.upsert(license);
            }
        } catch (error) {
            throw new QueryException(QueryException.save());
        }
    }
}
