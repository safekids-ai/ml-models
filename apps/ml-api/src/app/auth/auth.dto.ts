export class AuthDto {
    jwt_token: string;
    link?: string;
}

export interface UserDeviceLoginDTO {
    email: string;
    deviceType: string;
    os: string;
    chromeExtensionVersion: string;
    osBuild?: string;
    osDeviceName?: string;
    directoryApiId?: string;
    appVersion?: string;
    ethernetMac?: string;
    accessCode?: string;
}

export interface UserTokenDTO {
    deviceLinkId: string;
    userId: string;
    deviceId: string;
    accountId: string;
    email: string;
    userDeviceLinkId?: string;
}
