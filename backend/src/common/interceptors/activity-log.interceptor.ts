import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { SKIP_ACTIVITY_LOG_KEY } from '../decorators/skip-activity-log.decorator';
import { LogActivityService } from '../../logs/log-activity.service';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly logActivityService: LogActivityService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skip =
      this.reflector.getAllAndOverride<boolean>(SKIP_ACTIVITY_LOG_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;

    if (skip) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const method = String(request.method || '').toUpperCase();
    const shouldLog = ['POST', 'PATCH', 'DELETE'].includes(method);

    if (!shouldLog) {
      return next.handle();
    }

    const action = `${method} ${request.originalUrl || request.url}`;
    const userId = request.user?.id ?? null;

    return next.handle().pipe(
      tap({
        next: () => {
          void this.logActivityService.create({
            userId,
            action,
          }).catch(() => undefined);
        },
      }),
    );
  }
}
