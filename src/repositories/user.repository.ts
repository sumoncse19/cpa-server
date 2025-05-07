import { BaseRepository } from './base.repository';
import User, { UserAttributes, UserRole } from '../models/user.model';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log('Finding user by email:', email);
    const user = await this.findOne({ where: { email } });
    console.log('Found user:', user?.toJSON());
    return user;
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.findAll({ where: { role } });
  }

  async createUser(userData: Omit<UserAttributes, 'id'>): Promise<User> {
    return this.create(userData);
  }

  async updateUser(id: number, userData: Partial<UserAttributes>): Promise<[number, User[]]> {
    return this.update(id, userData);
  }

  async deactivateUser(id: number): Promise<[number, User[]]> {
    return this.update(id, { isActive: false });
  }

  async activateUser(id: number): Promise<[number, User[]]> {
    return this.update(id, { isActive: true });
  }
} 