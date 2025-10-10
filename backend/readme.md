# Goal Futsal Nepal Booking Backend

This is the backend server for Goal Futsal Nepal Booking, supporting user, admin, and futsal management. Built with Node.js, Express, and MariaDB, it provides RESTful APIs for booking, user management, payments, and facility administration.

## Features
- User registration, authentication, and profile management
- Admin panel for managing users, bookings, and facilities
- Facility listing and management with location tracking
- Booking system for futsal grounds
- Subscription and payment management
- Analytics and revenue tracking
- Secure authentication and authorization

## Tech Stack
- **Node.js** (Express.js)
- **MariaDB** (MySQL-compatible database)
- **Sequelize ORM** (Database modeling and migrations)
- **JWT** for authentication
- **Docker & Docker Compose** (Containerization)
- **PHPMyAdmin** (Database administration)

## Project Structure
```
backend/
├── app.js                      # Main application entry point
├── config/
│   └── dbConfig.js            # Database configuration
├── controllers/
│   └── authControllers/       # Authentication controllers
├── middleware/
│   └── authMiddleware/        # Authentication middleware
├── models/
│   ├── index.js              # Sequelize initialization & associations
│   ├── user/
│   │   └── userModel.js      # User model
│   └── footsal/
│       ├── footsalModel.js   # Main footsal facility model
│       ├── locationModel.js  # Location data model
│       ├── analyticsModel.js # Analytics & ratings model
│       ├── subscriptionModel.js # Subscription plans model
│       └── paymentModel.js   # Payment records model
├── routes/
│   └── authRoutes/           # Authentication routes
├── utils/
│   └── jwt/                  # JWT utilities
├── docker-compose.yml        # Docker services configuration
├── Dockerfile                # Backend container configuration
├── Makefile                  # Quick commands for Docker
├── .env                      # Environment variables
└── package.json              # Project dependencies
```

## 📊 Database Migrations

This project uses **Knex.js** for database migrations to keep your database schema in sync with code changes.

### Why Migrations?

- **Schema versioning**: Track all database changes over time
- **Team collaboration**: Share schema changes via version control
- **Safe updates**: Apply changes without data loss
- **Rollback support**: Revert changes if needed

### Migration Commands

```bash
# Run all pending migrations
npm run migrate

# Create a new migration file
npx knex migrate:make migration_name

# Rollback last migration
npx knex migrate:rollback

# Check migration status
npx knex migrate:status
```

### Creating a New Migration

When you change a model (e.g., add a column to `footsalModel.js`):

```bash
# 1. Create a migration file
npx knex migrate:make add_column_to_footsals

# 2. Edit the generated file in migrations/ folder
# Example: migrations/20250410120000_add_column_to_footsals.js
exports.up = function(knex) {
  return knex.schema.alterTable('footsals', function(table) {
    table.string('new_column');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('footsals', function(table) {
    table.dropColumn('new_column');
  });
};

# 3. Run the migration
npm run migrate
```

### Initial Setup Migration

The project includes an initial migration (`20250410000001_initial_schema.js`) that creates all tables. Run this after setting up your database:

```bash
npm run migrate
```

## Getting Started

### Option 1: Running with Docker (Recommended)

This is the easiest way to run the entire stack including database and PHPMyAdmin.

**Prerequisites:**
- Docker
- Docker Compose

**Steps:**

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Start all services:**
   ```bash
   make up
   # OR
   docker-compose up -d
   ```

3. **Access the services:**
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/health
   - PHPMyAdmin: http://localhost:8080
     - Server: `db`
     - Username: `footsal_user`
     - Password: `root`

4. **View logs:**
   ```bash
   docker-compose logs -f backend
   ```

5. **Stop all services:**
   ```bash
   make down
   # OR
   docker-compose down
   ```

### Option 2: Running Locally (Development)

For local development without Docker, you need to set up MariaDB separately.

**Prerequisites:**
- Node.js (v18+ recommended)
- MariaDB or MySQL installed locally

**Steps:**

1. **Install MariaDB/MySQL:**
   ```bash
   # Ubuntu/Debian
   sudo apt install mariadb-server
   
   # macOS
   brew install mariadb
   
   # Windows: Download from https://mariadb.org/download/
   ```

2. **Start MariaDB service:**
   ```bash
   # Linux
   sudo systemctl start mariadb
   
   # macOS
   brew services start mariadb
   ```

3. **Create database and user:**
   ```bash
   mysql -u root -p
   ```
   
   Then run these SQL commands:
   ```sql
   CREATE DATABASE footsal;
   CREATE USER 'footsal_user'@'localhost' IDENTIFIED BY 'root';
   GRANT ALL PRIVILEGES ON footsal.* TO 'footsal_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

5. **Install dependencies:**
   ```bash
   npm install
   ```

6. **Update .env file for local development:**
   
   Change `DB_HOST` from `db` to `localhost`:
   ```env
   PORT=3000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=footsal_user
   DB_PASSWORD=root
   DB_NAME=footsal
   ```

7. **Start the server:**
   ```bash
   npm start
   ```

8. **Access the services:**
   - Backend API: http://localhost:3000
   - Health Check: http://localhost:3000/health

## Environment Variables

| Variable | Description | Default | Docker | Local |
|----------|-------------|---------|--------|-------|
| PORT | Server port | 3000 | 3000 | 3000 |
| NODE_ENV | Environment | development | development | development |
| DB_HOST | Database host | db | `db` | `localhost` |
| DB_USER | Database user | footsal_user | footsal_user | footsal_user |
| DB_PASSWORD | Database password | root | root | root |
| DB_NAME | Database name | footsal | footsal | footsal |

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

## Database Models

### Users Table
- User authentication and profile information

### Footsal Tables
- **footsals**: Main facility information
- **footsal_locations**: Geographic location data
- **footsal_analytics**: Ratings, bookings, and revenue metrics
- **footsal_subscriptions**: Subscription plans and status
- **footsal_payments**: Payment records and transactions

## Troubleshooting

### Error: `getaddrinfo EAI_AGAIN db`
This means the app is trying to connect to Docker's `db` service but you're running locally.
**Solution:** Change `DB_HOST=db` to `DB_HOST=localhost` in your `.env` file.

### Error: `Access denied for user`
Database credentials are incorrect.
**Solution:** Verify your MariaDB user exists and has correct password.

### Error: `connect ECONNREFUSED 127.0.0.1:3306`
MariaDB is not running.
**Solution:** Start MariaDB service or Docker containers.

### Tables not appearing in database
The application must run at least once for Sequelize to create tables.
**Solution:** Start the backend, check logs for "CONNECTED TO DATABASE!!!"

## Makefile Commands

```bash
make up       # Start all Docker services
make down     # Stop all Docker services
make build    # Rebuild Docker images
make restart  # Restart all services
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
