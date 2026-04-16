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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogActivityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const base_crud_service_1 = require("../common/services/base-crud.service");
const user_entity_1 = require("../database/entities/user.entity");
const log_activity_entity_1 = require("../database/entities/log-activity.entity");
let LogActivityService = class LogActivityService extends base_crud_service_1.BaseCrudService {
    constructor(repository, userRepository) {
        super(repository);
        this.userRepository = userRepository;
    }
    sanitizeLog(log) {
        if (log.user && log.user.password) {
            const { password, ...publicUser } = log.user;
            return { ...log, user: publicUser };
        }
        return log;
    }
    findAll() {
        return this.repository
            .find({
            relations: { user: true },
            order: { id: 'DESC' },
        })
            .then((rows) => rows.map((row) => this.sanitizeLog(row)));
    }
    async findOne(id) {
        const log = await this.repository.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!log) {
            throw new common_1.NotFoundException(`Log activity #${id} not found`);
        }
        return this.sanitizeLog(log);
    }
    async create(dto) {
        const user = dto.userId ? await this.userRepository.findOne({ where: { id: dto.userId } }) : null;
        if (dto.userId && !user) {
            throw new common_1.NotFoundException(`User #${dto.userId} not found`);
        }
        return this.repository.save(this.repository.create({
            user,
            action: dto.action,
        })).then((saved) => this.sanitizeLog(saved));
    }
    async update(id, dto) {
        const log = await this.findOne(id);
        if (dto.userId !== undefined) {
            log.user = dto.userId
                ? await this.userRepository.findOne({ where: { id: dto.userId } })
                : null;
        }
        if (dto.action !== undefined) {
            log.action = dto.action;
        }
        return this.repository.save(log).then((saved) => this.sanitizeLog(saved));
    }
};
exports.LogActivityService = LogActivityService;
exports.LogActivityService = LogActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(log_activity_entity_1.LogActivityEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LogActivityService);
//# sourceMappingURL=log-activity.service.js.map