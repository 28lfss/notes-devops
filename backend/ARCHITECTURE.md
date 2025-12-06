# Backend Architecture Analysis & Improvements

## Architecture Overview

The backend follows a **Clean Architecture** pattern with clear separation of concerns:

```
src/
├── domain/          # Business entities and interfaces
├── repositories/    # Data access layer (Prisma)
├── services/        # Business logic layer
├── controllers/     # HTTP request handlers
├── middlewares/     # Cross-cutting concerns
├── config/          # Configuration and dependency management
├── app.ts           # Express app setup
└── server.ts        # Application bootstrap
```

## Architecture Patterns

### Clean Architecture Layers

1. **Domain Layer** (`domain/`)
   - Pure TypeScript interfaces
   - No dependencies on external libraries
   - Business entities: `User`, `Note`
   - Custom error classes: `AppError`, `ValidationError`, etc.

2. **Repository Layer** (`repositories/`)
   - Implements `IUserRepository` and `INoteRepository` interfaces
   - Encapsulates Prisma database access
   - Returns domain entities
   - Single responsibility: data persistence

3. **Service Layer** (`services/`)
   - Contains business logic
   - Depends on repository interfaces (not implementations)
   - Validates business rules
   - Throws domain-specific errors

4. **Controller Layer** (`controllers/`)
   - Handles HTTP requests/responses
   - Minimal logic (delegates to services)
   - Uses `asyncHandler` for error handling
   - Returns appropriate HTTP status codes

5. **Middleware Layer** (`middlewares/`)
   - Authentication (`authMiddleware`) - JWT token verification
   - Error handling (`errorHandler`, `asyncHandler`) - Centralized error handling
   - Input validation (`validation`) - Request body validation
   - CORS - Enabled for all origins
   - Body parsing - JSON and URL-encoded support

## Improvements Made

### 1. **Dependency Injection Consistency**
- Created `Dependencies` factory class for centralized dependency management
- Removed duplicate dependency creation
- Services depend on interfaces, not concrete classes

### 2. **Repository Interfaces**
- Added `IUserRepository` and `INoteRepository` interfaces
- Repositories implement interfaces for better testability
- Services depend on interfaces (Dependency Inversion Principle)

### 3. **Error Handling**
- AuthService constructor now throws `AppError` instead of generic `Error`
- Consistent use of custom error classes throughout
- Centralized error handling middleware

### 4. **Validation Improvements**
- Extracted common validation patterns into reusable helpers
- Added `validateUpdateNote` middleware
- Consistent validation error messages
- DRY principle applied

### 5. **Code Quality**
- Removed unused `password` field from `UserRepository.create()`
- Improved type safety with interfaces
- Added Prisma client graceful shutdown
- Consistent code organization

### 6. **Route Organization**
- Health check endpoint in routes (consistent with API structure)
- Root-level health check maintained for Docker/K8s compatibility

### 7. **Configurable API Prefix**
- Added `API_PREFIX` environment variable for dynamic API base path
- Defaults to `/api` if not specified
- Prefix is normalized (ensures it starts with `/` and doesn't end with `/`)
- All API routes are prefixed with the configured value

## Code Quality Metrics

- **Total Lines**: ~663 lines
- **Architecture Layers**: 5 (Domain, Repository, Service, Controller, Middleware)
- **Dependencies**: Properly injected via constructor
- **Error Handling**: Centralized with custom error classes
- **Validation**: Extracted to reusable middleware
- **Type Safety**: Full TypeScript coverage with interfaces

## Design Principles Followed

### SOLID Principles

- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension via interfaces
- **Liskov Substitution**: Interfaces allow substitution
- **Interface Segregation**: Focused interfaces (IUserRepository, INoteRepository)
- **Dependency Inversion**: Depend on abstractions (interfaces), not concretions

### Clean Code Principles

- **DRY**: No code duplication
- **Meaningful Names**: Clear, descriptive names
- **Small Functions**: Functions do one thing
- **Error Handling**: Consistent error handling strategy
- **Separation of Concerns**: Clear layer boundaries

## Testing Considerations

The architecture is designed for easy testing:

- **Repositories**: Can be mocked via interfaces
- **Services**: Can be tested with mock repositories
- **Controllers**: Can be tested with mock services
- **Middleware**: Can be tested in isolation

## Configuration

### Environment Variables

The backend supports the following environment variables (defined in `.env` or `.env.example`):

#### `DATABASE_URL`
- **Purpose**: PostgreSQL database connection string
- **Required**: Yes
- **Example**: `postgresql://user:password@localhost:5432/notes_db?schema=public`

#### `JWT_SECRET`
- **Purpose**: Secret key for JWT token signing and verification
- **Required**: Yes
- **Example**: `your-secret-key-change-in-production`
- **Security**: Must be a strong, random string in production

#### `PORT`
- **Purpose**: Server port number
- **Required**: No
- **Default**: `3000`
- **Example**: `3000`, `8080`

#### `NODE_ENV`
- **Purpose**: Node.js environment (affects error handling behavior)
- **Required**: No
- **Default**: `development`
- **Values**: `development`, `production`, `staging`
- **Note**: In development mode, error responses include stack traces

#### `API_PREFIX`
- **Purpose**: Base path prefix for all API endpoints
- **Required**: No
- **Default**: `/api`
- **Example**: `/api`, `/v1/api`, `/my-api`
- **Note**: Prefix is normalized (ensures it starts with `/` and doesn't end with `/`)
- **Usage**: All API routes are prefixed with this value (e.g., `/api/auth/login`)

### Application Setup

The Express application is configured with:
- **CORS**: Enabled for all origins (configurable via `cors()` middleware)
- **Body Parsing**: JSON and URL-encoded request bodies
- **Error Handling**: Centralized error handler middleware
- **404 Handler**: Custom handler for undefined routes

## Authentication

### JWT Token Management
- **Token Expiration**: 7 days
- **Token Format**: `Bearer <token>` in Authorization header
- **Token Storage**: Client-side (localStorage in frontend)
- **Token Verification**: Validated on every protected route via `authMiddleware`

### Password Security
- **Hashing Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Password Validation**: Minimum 6 characters (configurable)
- **Password Storage**: Never stored in plain text, only hashed

### Authentication Flow
1. User registers/logs in with email and password
2. Password is hashed using bcrypt
3. JWT token is generated with user ID
4. Token is returned to client
5. Client includes token in `Authorization: Bearer <token>` header
6. `authMiddleware` verifies token and extracts `userId`
7. `userId` is attached to `req.userId` via Express type augmentation

## Future Improvements (Optional)

1. **DI Container**: Consider using a DI container (Inversify, TSyringe) for larger apps
2. **Repository Base Class**: Could extract common Prisma patterns
3. **Service Interfaces**: Could add interfaces for services too
4. **Logging**: Consider using a proper logging library (Winston, Pino)
5. **CORS Configuration**: Make CORS origins configurable via environment variable
6. **Rate Limiting**: Add rate limiting middleware for API protection
7. **Request Validation**: Consider using a validation library (Joi, Zod) for more complex validation

## API Endpoints

**Note**: All API endpoints are prefixed with the `API_PREFIX` environment variable (defaults to `/api`). The examples below assume the default prefix.

### Authentication (Public)
- `POST {API_PREFIX}/auth/register` - Register a new user
  - Body: `{ email: string, password: string }`
  - Validation: Email format, password minimum 6 characters
  - Returns: `{ user: UserWithoutPassword, token: string }` (201 Created)
  - Errors: 400 if email exists or validation fails

- `POST {API_PREFIX}/auth/login` - Login user
  - Body: `{ email: string, password: string }`
  - Validation: Email and password required
  - Returns: `{ user: UserWithoutPassword, token: string }` (200 OK)
  - Errors: 401 if credentials are invalid

### Notes (Protected - Requires Authentication)
- `GET {API_PREFIX}/notes` - Get all user's notes
  - Headers: `Authorization: Bearer <token>`
  - Returns: `Note[]` (200 OK)
  - Returns only notes belonging to the authenticated user

- `GET {API_PREFIX}/notes/:id` - Get a specific note
  - Headers: `Authorization: Bearer <token>`
  - Returns: `Note` (200 OK)
  - Errors: 404 if note not found, 403 if note doesn't belong to user

- `POST {API_PREFIX}/notes` - Create a new note
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ title: string, content: string }`
  - Validation: Title and content are required and non-empty
  - Returns: `Note` (201 Created)
  - Errors: 400 if validation fails

- `PUT {API_PREFIX}/notes/:id` - Update a note
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ title?: string, content?: string }`
  - Validation: At least one field must be provided, provided fields must be non-empty
  - Returns: `Note` (200 OK)
  - Errors: 400 if validation fails, 404 if note not found, 403 if note doesn't belong to user

- `DELETE {API_PREFIX}/notes/:id` - Delete a note
  - Headers: `Authorization: Bearer <token>`
  - Returns: `204 No Content`
  - Errors: 404 if note not found, 403 if note doesn't belong to user

### Health Check
- `GET {API_PREFIX}/health` - Health check endpoint (within API routes)
  - Returns: `{ status: 'ok' }` (200 OK)

- `GET /health` - Root-level health check endpoint (for Docker/K8s)
  - Returns: `{ status: 'ok' }` (200 OK)
  - Note: This endpoint is not prefixed and is always available at root level

## Error Responses

All endpoints return consistent error responses:

**Production Mode:**
```json
{
  "error": "Error message"
}
```

**Development Mode:**
```json
{
  "error": "Error message",
  "stack": "Error stack trace..."
}
```

**Development Mode (Unexpected Errors - non-AppError):**
```json
{
  "error": "Internal server error",
  "message": "Original error message",
  "stack": "Error stack trace..."
}
```

### Error Classes

The application uses custom error classes from the domain layer:
- `AppError` - Base error class with status code
- `ValidationError` - 400 Bad Request (validation failures)
- `UnauthorizedError` - 401 Unauthorized (authentication failures)
- `ForbiddenError` - 403 Forbidden (authorization failures)
- `NotFoundError` - 404 Not Found (resource not found)

### Common Status Codes
- `400` - Bad Request (Validation errors, invalid input)
- `401` - Unauthorized (Invalid, expired, or missing token)
- `403` - Forbidden (User doesn't have access to resource)
- `404` - Not Found (Resource not found, invalid route)
- `500` - Internal Server Error (Unexpected errors)

### Error Handling Flow
1. Controllers use `asyncHandler` wrapper to catch async errors
2. Errors are passed to Express error handler middleware
3. `errorHandler` middleware checks if error is an `AppError` instance
4. If `AppError`: Returns error message with appropriate status code
5. If unknown error: Returns generic 500 error
6. Stack traces included only in development mode (`NODE_ENV=development`)

### 404 Handler
- Custom 404 handler for undefined routes
- Returns: `{ error: "Route not found" }` (404 Not Found)

## TypeScript Type Augmentation

The application extends Express's `Request` interface to include `userId`:

```typescript
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
```

This allows controllers to access `req.userId` after authentication middleware has verified the JWT token.

## Dependency Injection

The `Dependencies` class in `config/dependencies.ts` provides a singleton factory pattern for dependency management:
- **Pattern**: Singleton with lazy initialization
- **Benefits**: Centralized dependency creation, easy to mock for testing
- **Dependencies**: UserRepository → AuthService → AuthController, NoteRepository → NoteService → NoteController

## Current Status

- **Architecture**: Clean and well-organized
- **Code Quality**: High, follows best practices
- **Maintainability**: Easy to understand and modify
- **Testability**: Designed for easy testing
- **Scalability**: Can grow without major refactoring
- **API Documentation**: Endpoints documented above
- **Configuration**: Supports flexible environment-based configuration
- **Security**: JWT authentication, password hashing, input validation
- **Error Handling**: Comprehensive error handling with development mode support

