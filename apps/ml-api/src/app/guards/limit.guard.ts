import {
  Injectable,
  CanActivate,
  ExecutionContext,
  applyDecorators,
  UseGuards,
  SetMetadata,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class LimitGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const limit = this.reflector.get<string[]>('limit', context.getHandler())
    return limit > request.socket.bytesRead
  }
}

export const Limit = (limit: number) =>
  applyDecorators(UseGuards(LimitGuard), SetMetadata('limit', limit))
