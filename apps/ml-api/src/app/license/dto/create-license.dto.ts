import { LicenseAttributes } from '../entities/license.entity';

export class CreateLicenseDto implements LicenseAttributes {
    name: string;
    id?: string;
}
