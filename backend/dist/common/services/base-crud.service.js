"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCrudService = void 0;
const common_1 = require("@nestjs/common");
class BaseCrudService {
    constructor(repository) {
        this.repository = repository;
    }
    findAll() {
        return this.repository.find();
    }
    async findOne(id) {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) {
            throw new common_1.NotFoundException(`Entity #${id} not found`);
        }
        return entity;
    }
    create(payload) {
        const entity = this.repository.create(payload);
        return this.repository.save(entity);
    }
    async update(id, payload) {
        const existing = await this.findOne(id);
        const merged = this.repository.merge(existing, payload);
        return this.repository.save(merged);
    }
    async remove(id) {
        const entity = await this.findOne(id);
        await this.repository.remove(entity);
    }
}
exports.BaseCrudService = BaseCrudService;
//# sourceMappingURL=base-crud.service.js.map