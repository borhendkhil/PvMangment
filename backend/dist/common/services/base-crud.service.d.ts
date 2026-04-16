import { DeepPartial, Repository } from 'typeorm';
export declare abstract class BaseCrudService<TEntity extends {
    id: number;
}> {
    protected readonly repository: Repository<TEntity>;
    protected constructor(repository: Repository<TEntity>);
    findAll(): Promise<TEntity[]>;
    findOne(id: number): Promise<TEntity>;
    create(payload: DeepPartial<TEntity>): Promise<TEntity>;
    update(id: number, payload: DeepPartial<TEntity>): Promise<TEntity>;
    remove(id: number): Promise<void>;
}
