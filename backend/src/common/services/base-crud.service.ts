import { NotFoundException } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';

export abstract class BaseCrudService<TEntity extends { id: number }> {
  protected constructor(protected readonly repository: Repository<TEntity>) {}

  findAll(): Promise<TEntity[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<TEntity> {
    const entity = await this.repository.findOne({ where: { id } as any });
    if (!entity) {
      throw new NotFoundException(`Entity #${id} not found`);
    }
    return entity;
  }

  create(payload: DeepPartial<TEntity>): Promise<TEntity> {
    const entity = this.repository.create(payload);
    return this.repository.save(entity);
  }

  async update(id: number, payload: DeepPartial<TEntity>): Promise<TEntity> {
    const existing = await this.findOne(id);
    const merged = this.repository.merge(existing, payload);
    return this.repository.save(merged);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }
}
