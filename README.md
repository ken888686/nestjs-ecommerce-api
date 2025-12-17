# NestJS E-commerce API

An e-commerce backend API project built with the NestJS framework, using TypeScript, Prisma ORM, and PostgreSQL.

## Features

- **Framework**: Built on [NestJS](https://github.com/nestjs/nest) (Node.js framework)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**:
  - JWT (JSON Web Token) authentication
  - Passport.js integration
  - Password hashing (bcrypt)
- **API Documentation**:
  - Swagger UI integration
  - Multi-version API documentation (V1, V2)
  - JWT Bearer Auth support
- **API Versioning**: URI Versioning support (`/api/v1/...`)
- **Validation**: Data validation using `class-validator` and Pipes
- **Testing**: Comprehensive Jest unit tests (`.spec.ts`)

## Tech Stack

- **NestJS**: Backend framework
- **Prisma**: ORM and database migrations
- **PostgreSQL**: Relational database
- **Passport / JWT**: Authentication
- **Swagger**: API Documentation
- **Jest**: Testing framework
- **Docker**: (Optional) Containerization

## Installation & Running

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN=86400 # 1 day
```

### 3. Database Migration

Ensure PostgreSQL is running, then execute Prisma migration:

```bash
# Push schema to development database
npx prisma db push

# (Optional) Generate Prisma Client
npx prisma generate
```

### 4. Start the Application

```bash
# development watch mode
npm run start:dev

# production mode
npm run start:prod
```

The API runs at `http://localhost:3000` by default.

## API Documentation (Swagger)

Once the application is running, visit the following URLs in your browser to view the Swagger documentation:

- **Main Dashboard**: `http://localhost:3000/swagger`
- **V1 Documentation**: `http://localhost:3000/v1/swagger`

### Authentication Flow

1. Register a new account using `/api/auth/signup`
2. Login using `/api/auth/login` to obtain an `accessToken`
3. Click `Authorize` in the top right corner of Swagger UI and enter the token
4. Access protected APIs (e.g., `/api/v1/users`)

## Testing

The project includes comprehensive unit tests.

```bash
# Run all tests
npm run test

# Run test coverage report
npm run test:cov
```

## Project Structure

```tree
src/
├── app.module.ts       # Root module
├── main.ts             # Application entry point (Swagger, Versioning, Pipes config)
├── auth/               # Authentication module (Login, Register, JWT, Guards)
├── users/              # Users module (CRUD)
├── prisma/             # Prisma module (DB connection)
├── health/             # Health check module
└── common/             # Shared resources (DTOs, Interceptors etc.)
```

## License

[MIT licensed](LICENSE)
