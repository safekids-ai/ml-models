import { Inject, Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { STATUS_REPOSITORY } from '../constants';
import { Status } from './entities/status.entity';
import { QueryException } from '../error/common.exception';
import { defaultStatuses } from './default-status';

@Injectable()
export class StatusService {
    constructor(@Inject(STATUS_REPOSITORY) private readonly statusRepository: typeof Status) {}
    async create(createStatusDto: CreateStatusDto) {
        return await this.statusRepository.create(createStatusDto);
    }

    findAll() {
        return this.statusRepository.findAll();
    }

    async findOne(id: string): Promise<Status> {
        return await this.statusRepository.findOne({ where: { id } });
    }

    findByStatus(name: string): Promise<Status> {
        return this.statusRepository.findOne({ where: { status: name } });
    }

    update(id: string, updateStatusDto: UpdateStatusDto) {
        return this.statusRepository.update(updateStatusDto, { where: { id } });
    }

    remove(id: string) {
        return this.statusRepository.destroy({ where: { id } });
    }

    async seedDefaultStatuses() {
        try {
            for (const status of defaultStatuses) {
                await this.statusRepository.upsert(status);
            }
        } catch (error) {
            throw new QueryException(QueryException.save());
        }
    }
}
