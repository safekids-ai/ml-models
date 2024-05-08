import { PrrNotificationAttributes } from '../entities/prr-notification.entity';

export class CreatePrrNotificationDto implements PrrNotificationAttributes {
    accountId: string;
    activityId: number;
    contact: string;
    expired?: boolean;
    expiredAt?: Date;
    expiryDate?: Date;
    id?: string;
    phoneNumber: string;
    read?: boolean;
    readAt?: Date;
    url: string;
}

export class PrrNotificationDto {
    id?: string;
    accountId?: string;
    contact: string;
    category?: string;
    phoneNumber: string;
    url?: string;
    notificationUrl?: string;
    kidName: string;
    type?: string;
}
