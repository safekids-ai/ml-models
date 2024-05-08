import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IsAdminGuard extends AuthGuard('is-admin') {}
