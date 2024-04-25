import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OrgUnitService } from '../../org-unit/org-unit.service';
import { ValidationException } from '../../error/common.exception';
import { OrgUnitErrors } from '../../org-unit/org-unit.errors';
import { ORG_UNIT_REPOSITORY } from '../../constants';
import { OrgUnit } from '../../org-unit/entities/org-unit.entity';

@Injectable()
export class OrgUnitsValidator implements CanActivate {
    constructor(
        @Inject(ORG_UNIT_REPOSITORY)
        private readonly orgUnitRepository: typeof OrgUnit
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const orgUnits = await this.orgUnitRepository.findAll<OrgUnit>({ where: { accountId: request.user.accountId } });
        const dbOrgUnitIds = orgUnits.map((unit) => unit.id);
        const invalidUnits = request.body.orgUnitIds.filter((id) => !dbOrgUnitIds.includes(id));
        if (invalidUnits.length > 0) {
            throw new ValidationException(OrgUnitErrors.invalidUnits(invalidUnits));
        }
        return true;
    }
}
