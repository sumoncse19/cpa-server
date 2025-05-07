import { Model, ModelStatic, WhereOptions } from 'sequelize';
import { UserAttributes } from '../types/user.types';

export class BaseRepository<T extends Model> {
  constructor(protected model: ModelStatic<T>) {}

  async findById(id: number): Promise<T | null> {
    return this.model.findByPk(id);
  }

  async findOne(options: any): Promise<T | null> {
    return this.model.findOne(options);
  }

  async findAll(options?: any): Promise<T[]> {
    return this.model.findAll(options);
  }

  async create(data: Partial<UserAttributes>): Promise<T> {
    return this.model.create(data as any);
  }

  async update(id: number, data: Partial<UserAttributes>): Promise<[number, T[]]> {
    const where: WhereOptions = { id: id as any };
    return this.model.update(data as any, {
      where,
      returning: true
    });
  }

  async delete(id: number): Promise<number> {
    const where: WhereOptions = { id: id as any };
    return this.model.destroy({
      where
    });
  }
} 