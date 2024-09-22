import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ChromeExtensionOpenAuthGuard extends AuthGuard('chrome-extension-auth-open') {}
