import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthController } from './controllers/auth.controller';
import { authenticate, authorize } from './middleware/auth.middleware';
import { UserRole } from './types/user.types';
import { sequelize } from './models';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Controllers
const authController = new AuthController();

// Routes
app.post('/api/auth/login', (req: Request, res: Response) => authController.login(req, res));
app.post('/api/auth/register', authenticate, (req: Request, res: Response) => authController.register(req, res));

// Protected routes
app.get('/api/users', authenticate, authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]), (_req: Request, res: Response) => {
  res.json({ message: 'User listing endpoint' });
});

app.get('/api/customers', authenticate, authorize([UserRole.SUPER_ADMIN, UserRole.ADMIN]), (_req: Request, res: Response) => {
  res.json({ message: 'Customer listing endpoint' });
});

// Add types to your route handlers
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}); 