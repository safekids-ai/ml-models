import { Inject, Injectable } from '@nestjs/common';
import { DEVICE_REPOSITORY } from '../constants';
import { ChromeDeviceDTO, CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device, DeviceAttributes } from './entities/device.entity';
import { DeviceTypeService } from '../device-type/device-type.service';
import { uuid } from 'uuidv4';
import { DeviceTypes } from '../device-type/device-type.enum';
import { Statuses } from '../status/default-status';
import { QueryException } from '../error/common.exception';
import { LoggingService } from '../logger/logging.service';

@Injectable()
export class DeviceService {
    constructor(
        @Inject(DEVICE_REPOSITORY)
        private readonly repository: typeof Device,
        private deviceTypeService: DeviceTypeService,
        private readonly log: LoggingService
    ) {
        this.log.className(DeviceService.name);
    }
    create(createDeviceDto: DeviceAttributes) {
        createDeviceDto.id = uuid();
        return this.repository.create(createDeviceDto);
    }

    findAll() {
        return this.repository.findAll();
    }

    findOne(id: string) {
        return this.repository.findOne({ where: { id } });
    }

    update(id: string, updateDeviceDto: UpdateDeviceDto) {
        return this.repository.update(updateDeviceDto, { where: { id } });
    }

    upsert(dto: CreateDeviceDto) {
        return this.repository.upsert(dto);
    }

    remove(id: string) {
        return this.repository.destroy({ where: { id } });
    }

    async registerDevice(device: ChromeDeviceDTO, accountId: string, rootOrgUnitId: string) {
        let savedDevice = null;
        if (device.deviceType === DeviceTypes.DESKTOP) {
            device.osDeviceName = device.osDeviceName ? device.osDeviceName : device.ethernetMac ? device.ethernetMac : device.deviceType + '-DEVICE';
            if (device.ethernetMac) {
                savedDevice = await this.findOneByEthernetMac(device.ethernetMac);
            }
        } else if (device.deviceType === DeviceTypes.CHROMEBOOK) {
            device.osDeviceName = device.osDeviceName ? device.osDeviceName : device.directoryApiId ? device.directoryApiId : device.deviceType + '-DEVICE';
            savedDevice = await this.findOneByDirectoryApiId(device.directoryApiId);
        } else {
            device.osDeviceName = device.osDeviceName ? device.osDeviceName : device.deviceType + '-DEVICE';
            savedDevice = await this.findOneByDirectoryApiId(device.directoryApiId);
        }

        if (!savedDevice) {
            const newDevice: DeviceAttributes = {
                name: device.osDeviceName,
                directoryApiId: device.directoryApiId,
                deviceTypeId: device.deviceType,
                os: device.os,
                orgUnitId: rootOrgUnitId,
                accountId,
                ethernetMac: device.ethernetMac,
                statusId: Statuses.ACTIVE,
            };
            savedDevice = await this.create(newDevice);
        }
        return savedDevice;
    }

    async findOneByDirectoryApiId(deviceId: string) {
        return await this.repository.findOne({
            where: { directoryApiId: deviceId },
        });
    }

    async deleteAll(ids: string[]): Promise<void> {
        try {
            await this.repository.destroy({ where: { orgUnitId: ids } });
        } catch (e) {
            this.log.error(QueryException.delete(e));
            throw new QueryException(QueryException.delete());
        }
    }

    async findAllByOrgUnits(ids: string[]): Promise<Device[]> {
        return await this.repository.findAll({ where: { orgUnitId: ids } });
    }

    private async findOneByEthernetMac(ethernetMac: string) {
        return await this.repository.findOne({
            where: { ethernetMac: ethernetMac },
        });
    }
}
