import { Model, ModelCtor } from 'sequelize';

export abstract class BaseRepository<T extends Model> {
  protected model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  async findAll(options: any = {}): Promise<T[]> {
    return this.model.findAll(options);
  }

  async findById(id: number, options: any = {}): Promise<T | null> {
    return this.model.findByPk(id, options);
  }

  async create(data: any): Promise<T> {
    return this.model.create(data);
  }

  async update(id: number, data: any): Promise<[number, T[]]> {
    return this.model.update(data, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<number> {
    return this.model.destroy({
      where: { id },
    });
  }

  async findOne(options: any): Promise<T | null> {
    console.log('Executing findOne with options:', JSON.stringify(options, null, 2));
    const result = await this.model.findOne(options);
    console.log('findOne result:', result?.toJSON());
    return result;
  }
} 