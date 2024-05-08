import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class DesktopAuthGuard extends AuthGuard('desktop-auth') {}
