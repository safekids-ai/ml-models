import { Inject, Injectable } from '@nestjs/common';
import { DEVICE_TYPE_REPOSITORY } from '../constants';
import { DeviceType } from './entities/device-type.entity';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from './dto/update-device-type.dto';
import { QueryException } from '../error/common.exception';

@Injectable()
export class DeviceTypeService {
    constructor(@Inject(DEVICE_TYPE_REPOSITORY) private readonly deviceTypeRepository: typeof DeviceType) {}

    create(createDeviceTypeDto: CreateDeviceTypeDto) {
        return this.deviceTypeRepository.create(createDeviceTypeDto);
    }

    findAll() {
        return this.deviceTypeRepository.findAll();
    }

    findOne(id: string) {
        return this.deviceTypeRepository.findOne({ where: { id } });
    }

    async findByName(name: string): Promise<DeviceType> {
        return await this.deviceTypeRepository.findOne({ where: { name: name } });
    }

    update(id: string, updateDeviceTypeDto: UpdateDeviceTypeDto) {
        return this.deviceTypeRepository.update(updateDeviceTypeDto, { where: { id } });
    }

    remove(id: string) {
        return this.deviceTypeRepository.destroy({ where: { id } });
    }

    async seedDefaultData() {
        try {
            await this.deviceTypeRepository.upsert({ id: 'CHROMEBOOK', name: 'CHROMEBOOK' });
            await this.deviceTypeRepository.upsert({ id: 'IPAD', name: 'IPAD' });
            await this.deviceTypeRepository.upsert({ id: 'DESKTOP', name: 'DESKTOP' });
        } catch (error) {
            throw new QueryException(QueryException.save());
        }
    }
}
