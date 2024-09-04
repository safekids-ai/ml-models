import { Inject, Injectable } from '@nestjs/common';
import { CreateWebTimeDto } from './dto/create-web-time.dto';
import { UpdateWebTimeDto } from './dto/update-web-time.dto';
import { WEBTIME_REPOSITORY } from '../constants';
import { WebTime } from './entities/web-time.entity';

@Injectable()
export class WebTimeService {
    constructor(@Inject(WEBTIME_REPOSITORY) private readonly repository: typeof WebTime) {}

    async create(createWebTimeDto: CreateWebTimeDto) {
        return this.repository.create(createWebTimeDto);
    }

    async findAll() {
        return this.repository.findAll();
    }

    async findOne(id: number) {
        return this.repository.findOne({ where: { id } });
    }

    async update(id: number, updateWebTimeDto: UpdateWebTimeDto) {
        return this.repository.update(updateWebTimeDto, { where: { id } });
    }

    async remove(id: number) {
        return this.repository.destroy({ where: { id } });
    }

    async deleteAll(ids: string[]): Promise<void> {
        await this.repository.destroy({ where: { orgUnitId: ids } });
    }
}
