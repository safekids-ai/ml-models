import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IsAdminOrDistrictGuard extends AuthGuard('is-admin-or-district') {}
