import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { UserAttributes } from '../types/user.types';
import { SignOptions } from 'jsonwebtoken';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(email: string, password: string): Promise<{ token: string; user: Partial<UserAttributes> }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };
  }

  async register(userData: Omit<UserAttributes, 'id'>): Promise<{ token: string; user: Partial<UserAttributes> }> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await this.userRepository.createUser(userData);
    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toJSON();

    return {
      token,
      user: userWithoutPassword,
    };
  }

  private generateToken(user: UserAttributes): string {
    const payload = {
      id: user.id,
      role: user.role
    };

    const options: SignOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : 86400 // 24 hours in seconds
    };

    return jwt.sign(payload, process.env.JWT_SECRET as string, options);
  }
} 