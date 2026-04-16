"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipActivityLog = exports.SKIP_ACTIVITY_LOG_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.SKIP_ACTIVITY_LOG_KEY = 'skipActivityLog';
const SkipActivityLog = () => (0, common_1.SetMetadata)(exports.SKIP_ACTIVITY_LOG_KEY, true);
exports.SkipActivityLog = SkipActivityLog;
//# sourceMappingURL=skip-activity-log.decorator.js.map