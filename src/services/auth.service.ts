import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { UserAttributes, UserRole } from '../models/user.model';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(email: string, password: string): Promise<{ token: string; user: Partial<UserAttributes> }> {
    console.log('=== Login Attempt ===');
    console.log('Email:', email);
    console.log('Password:', password);
    
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      console.log('❌ User not found');
      throw new Error('Invalid credentials');
    }

    console.log('✅ User found:', JSON.stringify(user.toJSON(), null, 2));
    const isValidPassword = await user.comparePassword(password);
    console.log('Password validation result:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Invalid password');
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      console.log('❌ User is inactive');
      throw new Error('Account is inactive');
    }

    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toJSON();
    console.log('✅ Login successful');
    console.log('=== End Login Attempt ===');

    return {
      token,
      user: userWithoutPassword,
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
      role: user.role,
    };
    const options: SignOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_key', options);
  }
} 