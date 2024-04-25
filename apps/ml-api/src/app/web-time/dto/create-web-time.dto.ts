import { WebTimeAttributes } from '../entities/web-time.entity';

export class CreateWebTimeDto implements WebTimeAttributes {
    accountId: string;
    browser: string;
    browserVersion: string;
    deviceId: string;
    deviceIpAddress: string;
    deviceMacAddress: string;
    devicePublicWan: string;
    extensionVersion: string;
    fullUrl: string;
    hostname: string;
    id: number;
    ip: string;
    location: string;
    orgUnitId: string;
    userDevicesId: string;
    userEmail: string;
    userDeviceLinkId?: string;
    userId: string;
    duration?: number;
    visitedAt: Date;
}
