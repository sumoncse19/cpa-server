# CPA Backend

A robust backend system for CPA (Certified Public Accountant) management built with Node.js, TypeScript, and PostgreSQL.

## Features

- 🔐 JWT-based authentication
- 👥 Role-based access control (SuperAdmin, Admin, Customer)
- 🏗️ Repository pattern for clean architecture
- 📦 TypeScript for type safety
- 🗄️ PostgreSQL database with Sequelize ORM
- 🔄 RESTful API endpoints

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 or higher)
- [Git](https://git-scm.com/downloads)

### Installing PostgreSQL

#### For Windows:
1. Download the installer from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
2. Run the installer
3. Follow the installation wizard
4. Remember the password you set for the postgres user
5. Keep the default port (5432)

#### For macOS:
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14
```

#### For Ubuntu/Debian:
```bash
# Add PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
sudo service postgresql start
```

## Project Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd cpa-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a PostgreSQL database:
```bash
# Connect to PostgreSQL
psql -U postgres

# In the PostgreSQL prompt, create the database
CREATE DATABASE cpa_db;

# Exit PostgreSQL
\q
```

4. Create a `.env` file in the project root:
```bash
# Database Configuration
DB_USER=your_postgres_username | pc_user_name
DB_PASSWORD=your_postgres_password | 123456
DB_NAME=cpa_db
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 🔐 Generating a Secure JWT Secret

You can generate a secure JWT secret using one of these methods:

1. Using Node.js crypto (recommended):
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

2. Using OpenSSL:
```bash
openssl rand -hex 64
```

3. Using a secure online generator (for development only):
```bash
# Visit https://generate-secret.vercel.app/32
# Or https://randomkeygen.com/
```

Copy the generated secret and replace `your_jwt_secret_key` in your `.env` file.

⚠️ Security Best Practices:
- Never share your JWT secret
- Use different secrets for development and production
- Make the secret at least 32 characters long
- Use a mix of numbers, letters, and special characters
- Rotate the secret periodically

5. Run database migrations:
```bash
npm run migrate
```

6. Seed the database with initial data:
```bash
npm run seed
```

## Running the Project

### Development Mode
```bash
npm run dev
```
The server will start on http://localhost:3000

### Production Mode
```bash
npm run build
npm start
```

## API Documentation

### Authentication Endpoints

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "superadmin@example.com",
  "password": "admin123"
}
```

#### Register (Requires Authentication)
```bash
POST /api/auth/register
Content-Type: application/json
Authorization: Bearer <your_token>

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CUSTOMER"
}
```

## Default Super Admin Credentials
- Email: superadmin@example.com
- Password: admin123

## Project Structure
```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── database/       # Database migrations and seeders
├── middleware/     # Custom middleware
├── models/         # Database models
├── repositories/   # Data access layer
├── routes/         # API routes
├── services/       # Business logic
└── utils/          # Utility functions
```

## Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the project
- `npm start`: Start production server
- `npm run migrate`: Run database migrations
- `npm run seed`: Seed the database
- `npm run test`: Run tests
- `npm run lint`: Run linter
- `npm run format`: Format code with Prettier

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running:
```bash
# Windows
net start postgresql

# macOS
brew services list

# Linux
sudo service postgresql status
```

2. Verify database credentials in `.env` file
3. Check if the database exists:
```bash
psql -U postgres -l
```

### Port Already in Use
If port 3000 is already in use, you can:
1. Kill the process using the port:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

2. Or change the port in `.env` file

### PostgreSQL Authentication Issues

#### Peer Authentication Error
If you get this error:
```bash
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL: Peer authentication failed for user "postgres"
```

Follow these steps to fix it:

1. Switch to postgres system user:
```bash
sudo -i -u postgres
```

2. Now you can access PostgreSQL:
```bash
psql
```

3. Set a password for postgres user:
```sql
ALTER USER postgres PASSWORD 'your_password';
```

4. Exit PostgreSQL and postgres user:
```sql
\q
exit
```

5. Edit PostgreSQL authentication configuration:
```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

6. Find the line that looks like this:
```
local   all             postgres                                peer
```

7. Change it to:
```
local   all             postgres                                md5
```

8. Restart PostgreSQL:
```bash
sudo service postgresql restart
```

9. Now you can connect using:
```bash
psql -U postgres -d cpa_db
```

#### Alternative Connection Methods
If you still have issues, try these alternatives:

1. Connect as your system user:
```bash
sudo -u postgres psql
```

2. Or specify the host:
```bash
psql -h localhost -U postgres
```

3. Or use the full connection string:
```bash
psql "postgresql://postgres:your_password@localhost:5432/cpa_db"
```

## 🚀 Deployment

### Vercel vs Render Comparison

| Feature               | Vercel           | Render           |
|-----------------------|------------------|------------------|
| Free Tier             | ✅                | ✅ |
| Node.js Support       | ✅                | ✅ |
| PostgreSQL Support    | ✅ (via add-ons)  | ✅ (via add-ons) |
| Auto Deploy           | ✅                | ✅ |
| Custom Domains        | ✅                | ✅ |
| Environment Variables | ✅                | ✅ |
| Build Commands        | ✅                | ✅ |
| Cold Starts           | ⚠️ (Serverless)   | ✅ (Always on) |
| Database Connection   | ⚠️ (Needs add-on) | ✅ (Built-in) |
| CLI Tool              | ✅                | ✅ |

### Recommended: Render
For this project, we recommend **Render** because:
1. Better PostgreSQL integration
2. No cold starts (always-on instances)
3. Simpler database connection setup
4. More generous free tier for backend services

### Deploying to Render

1. **Create a Render Account**
   - Visit [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure the Service**
   ```bash
   Name: cpa-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Add Environment Variables**
   ```bash
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   DB_NAME=cpa_db
   DB_HOST=your_render_postgres_host
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=24h
   NODE_ENV=production
   PORT=10000
   ```

5. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Choose a name and region
   - Copy the connection details to your environment variables

6. **Deploy**
   - Click "Create Web Service"
   - Wait for the build and deployment to complete

### Deploying to Vercel

1. **Create a Vercel Account**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

3. **Deploy**
   ```bash
   # Login to Vercel
   vercel login

   # Deploy
   vercel
   ```

4. **Configure Environment Variables**
   - Go to your project settings in Vercel dashboard
   - Add all environment variables from your `.env` file

5. **Add PostgreSQL**
   - Use a service like [Neon](https://neon.tech) or [Supabase](https://supabase.com)
   - Update your database connection string in environment variables

### Post-Deployment

1. **Run Migrations**
   ```bash
   # For Render
   npm run migrate

   # For Vercel
   vercel env pull .env.production
   npm run migrate
   ```

2. **Verify Deployment**
   ```bash
   # Test the API
   curl https://your-app-url/api/health
   ```

3. **Monitor Logs**
   - Render: Dashboard → Your Service → Logs
   - Vercel: Dashboard → Your Project → Deployments → Latest → Logs

### Important Notes

1. **Database Backups**
   - Set up regular backups for your production database
   - Keep backup files secure

2. **Security**
   - Use strong passwords
   - Enable SSL/TLS
   - Set up proper CORS configuration
   - Use environment variables for all secrets

3. **Monitoring**
   - Set up error tracking (e.g., Sentry)
   - Monitor database performance
   - Set up alerts for critical issues

4. **Scaling**
   - Start with the free tier
   - Monitor resource usage
   - Upgrade when needed