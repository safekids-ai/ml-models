import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../constants';
import { Role } from './entities/role.entity';
import { QueryException } from '../error/common.exception';
import { defaultRoles } from '../user/user.roles';

@Injectable()
export class RoleService {
    constructor(@Inject(ROLE_REPOSITORY) private readonly repository: typeof Role) {}
    create(dto = {}) {
        return this.repository.create(dto);
    }

    findAll() {
        return this.repository.findAll();
    }

    findOne(id: number) {
        return this.repository.findOne({ where: { id } });
    }

    update(id: number, dto = {}) {
        return this.repository.update(dto, { where: { id } });
    }

    upsert(dto = {}) {
        return this.repository.upsert(dto);
    }

    remove(id: number) {
        return this.repository.destroy({ where: { id } });
    }

    async seedDefaultData() {
        try {
            for (const status of defaultRoles) {
                await this.repository.upsert(status);
            }
        } catch (error) {
            throw new QueryException(QueryException.save());
        }
    }
}
