# Notes DevOps Project

A fullstack notes application with DevOps best practices.

## Architecture

- **Backend**: Express.js + TypeScript + Prisma ORM (Clean Architecture)
- **Frontend**: React + Vite + TypeScript (Feature-Based Architecture)
- **Database**: PostgreSQL
- **Infrastructure**: Docker + Docker Compose
- **Monitoring**: Zabbix + Grafana
- **Cloud**: AWS EC2
- **CI/CD**: GitHub Actions

For detailed architecture documentation, see:
- [Backend Architecture](./backend/ARCHITECTURE.md)
- [Frontend Architecture](./frontend/ARCHITECTURE.md)

## Project Structure

```
notes-devops/
  backend/     # Express API
  frontend/    # React application
  infra/       # Docker compose, scripts, monitoring configs
```

## Getting Started

### Prerequisites

- Docker & Docker Compose
- (Optional) Node.js 18+ for local development without Docker

### Running with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd notes-devops
   ```

2. Set up environment variables:
   ```bash
   # Copy example files and customize
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Edit .env files and set your JWT_SECRET (required)
   # Generate a secure secret: openssl rand -base64 32
   ```
   
   **Required variables:**
   - `JWT_SECRET` (backend) - Secret key for JWT token signing
   
   **Optional variables:**
   - `DATABASE_URL` (backend) - PostgreSQL connection string (defaults provided in docker-compose)
   - `PORT` (backend) - Server port (defaults to 3000)
   - `NODE_ENV` (backend) - Node environment (defaults to development)
   - `API_PREFIX` (backend) - API base path prefix (defaults to /api)
   - `VITE_API_URL` (frontend) - API base URL (defaults to /api, should match API_PREFIX)
   - `VITE_FRONTEND_PREFIX` (frontend) - Frontend base path prefix (defaults to empty for root)

3. Start all services:
   ```bash
   docker compose -f infra/docker-compose.dev.yml up --build
   ```
   
   **Note**: If you're using Docker Compose v2 (default in newer Docker versions), use `docker compose` (without hyphen). For older versions, use `docker-compose`.

4. Access the application:
   - Frontend: http://localhost:8080 (or with prefix if VITE_FRONTEND_PREFIX is set)
   - Backend API: http://localhost:8080/api (or with custom prefix if API_PREFIX is set)
   - PostgreSQL: localhost:5432

### Services

- **Frontend**: React app served via nginx on port 8080
- **Backend**: Express API on port 3000 (internal, proxied via nginx)
- **PostgreSQL**: Database on port 5432

### Development

To run services individually (without Docker):

```bash
# Backend only
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npm install
npm run dev

# Frontend only
cd frontend
cp .env.example .env
# Edit .env if you need to change VITE_API_URL or VITE_FRONTEND_PREFIX
npm install
npm run dev
```

**Note**: Make sure PostgreSQL is running and accessible when running backend locally.

## Branches

- `main` → production
- `staging` → staging environment
- `develop` → development work (feature branches branch off this)

