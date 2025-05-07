import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error instanceof Error ? error.message : 'Authentication failed' });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, role = UserRole.CUSTOMER } = req.body;
      
      // Only allow SUPER_ADMIN to create ADMIN users
      if (role === UserRole.ADMIN && req.user?.role !== UserRole.SUPER_ADMIN) {
        res.status(403).json({ message: 'Only Super Admin can create Admin users' });
        return;
      }

      const result = await this.authService.register({
        email,
        password,
        firstName,
        lastName,
        role,
        isActive: true,
      });

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
    }
  }
} 