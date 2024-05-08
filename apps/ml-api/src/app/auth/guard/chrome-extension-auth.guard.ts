import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ChromeExtensionAuthGuard extends AuthGuard('chrome-extension-auth') {}
