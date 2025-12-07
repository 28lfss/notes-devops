# Notes DevOps Project

A fullstack notes application with DevOps best practices.

## Architecture

- **Backend**: Express.js + TypeScript + Prisma ORM (Clean Architecture)
- **Frontend**: React + Vite + TypeScript (Feature-Based Architecture)
- **Database**: PostgreSQL
- **Infrastructure**: Docker + Docker Compose
- **Monitoring**: Zabbix + Grafana
- **Cloud**: AWS (ECS Fargate + ALB + RDS)
- **CI/CD**: GitHub Actions

For detailed architecture documentation, see:
- [Backend Architecture](./backend/ARCHITECTURE.md)
- [Frontend Architecture](./frontend/ARCHITECTURE.md)
- [AWS Infrastructure Setup](./AWS-SETUP.md)

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

1. **Navigate to the project root:**
   ```bash
   cd notes-devops
   ```

2. **(Optional) Set JWT_SECRET environment variable:**
   ```bash
   export JWT_SECRET=$(openssl rand -base64 32)
   ```
   Or use the default from docker-compose (`dev-secret-change-in-production`).

3. **Start all services:**
   ```bash
   docker compose -f infra/docker-compose.dev.yml up --build
   ```
   
   Or run in detached mode:
   ```bash
   docker compose -f infra/docker-compose.dev.yml up --build -d
   ```
   
   **Note**: If you're using Docker Compose v2 (default in newer Docker versions), use `docker compose` (without hyphen). For older versions, use `docker-compose`.

4. **Wait for services to be ready:**
   - PostgreSQL starts first (health check)
   - Backend waits for PostgreSQL, then runs migrations automatically
   - Frontend starts after backend

5. **Access the application:**
   - **Frontend**: http://localhost:8080
   - **Backend API**: http://localhost:8080/api
   - **PostgreSQL**: localhost:5432
     - User: `notes_user`
     - Password: `notes_password`
     - Database: `notes_db`

6. **Check service status:**
   ```bash
   docker compose -f infra/docker-compose.dev.yml ps
   ```

7. **View logs:**
   ```bash
   docker compose -f infra/docker-compose.dev.yml logs -f
   ```
   Or for a specific service:
   ```bash
   docker compose -f infra/docker-compose.dev.yml logs -f backend
   ```

8. **Stop services:**
   ```bash
   docker compose -f infra/docker-compose.dev.yml down
   ```
   To also remove volumes:
   ```bash
   docker compose -f infra/docker-compose.dev.yml down -v
   ```

**Note:** Database migrations run automatically via the backend entrypoint script when the backend starts. The database is created and migrated on first run.

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

