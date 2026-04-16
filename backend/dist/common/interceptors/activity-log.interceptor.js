"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const skip_activity_log_decorator_1 = require("../decorators/skip-activity-log.decorator");
const log_activity_service_1 = require("../../logs/log-activity.service");
let ActivityLogInterceptor = class ActivityLogInterceptor {
    constructor(reflector, logActivityService) {
        this.reflector = reflector;
        this.logActivityService = logActivityService;
    }
    intercept(context, next) {
        const skip = this.reflector.getAllAndOverride(skip_activity_log_decorator_1.SKIP_ACTIVITY_LOG_KEY, [
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
        return next.handle().pipe((0, rxjs_1.tap)({
            next: () => {
                void this.logActivityService.create({
                    userId,
                    action,
                }).catch(() => undefined);
            },
        }));
    }
};
exports.ActivityLogInterceptor = ActivityLogInterceptor;
exports.ActivityLogInterceptor = ActivityLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        log_activity_service_1.LogActivityService])
], ActivityLogInterceptor);
//# sourceMappingURL=activity-log.interceptor.js.map