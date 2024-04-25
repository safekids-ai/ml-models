import { DeviceAttributes } from '../entities/device.entity';

export class CreateDeviceDto implements DeviceAttributes {
    cpuModel: string;
    deviceId: string;
    deviceTypeId: string;
    directoryApiId: string;
    ethernetMac: string;
    id: string;
    imei: string;
    name: string;
    osVersion: string;
    platformVersion: string;
    schoolsId: number;
    serialNumber: string;
    wifiMac: string;
}

export interface ChromeDeviceDTO {
    directoryApiId?: string;
    ethernetMac?: string;
    deviceType: string;
    os: string;
    osBuild: string;
    osDeviceName: string;
}
