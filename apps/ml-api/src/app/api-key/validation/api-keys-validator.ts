import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { OneRosterService } from '../../roster/roster.service';
import { ValidationException } from '../../error/common.exception';

@Injectable()
export class ApiKeysValidator implements CanActivate {
    constructor(private readonly service: OneRosterService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const apiKey = {
            hostUrl: request.body.hostUrl,
            accessKey: request.body.accessKey,
            secret: request.body.secret,
        };
        try {
            await this.service.getAccessToken(apiKey);
            return true;
        } catch (e) {
            throw new ValidationException('Invalid credentials!');
        }
    }
}
