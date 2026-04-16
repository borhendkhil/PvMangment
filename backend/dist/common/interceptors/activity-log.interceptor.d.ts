import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { LogActivityService } from '../../logs/log-activity.service';
export declare class ActivityLogInterceptor implements NestInterceptor {
    private readonly reflector;
    private readonly logActivityService;
    constructor(reflector: Reflector, logActivityService: LogActivityService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
