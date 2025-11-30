# Notes DevOps Project

A fullstack notes application with DevOps best practices.

## Architecture

- **Backend**: Express.js + TypeScript + Prisma ORM
- **Frontend**: React + Vite + TypeScript
- **Database**: PostgreSQL
- **Infrastructure**: Docker + Docker Compose
- **Monitoring**: Zabbix + Grafana
- **Cloud**: AWS EC2
- **CI/CD**: GitHub Actions

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

2. Set up environment variables (optional, defaults provided):
   ```bash
   # Create .env file in root directory
   JWT_SECRET=your-secret-key-change-in-production
   ```

3. Start all services:
   ```bash
   docker compose -f infra/docker-compose.dev.yml up --build
   ```
   
   **Note**: If you're using Docker Compose v2 (default in newer Docker versions), use `docker compose` (without hyphen). For older versions, use `docker-compose`.

4. Access the application:
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8080/api
   - PostgreSQL: localhost:5432

### Services

- **Frontend**: React app served via nginx on port 8080
- **Backend**: Express API on port 3000 (internal, proxied via nginx)
- **PostgreSQL**: Database on port 5432

### Development

To run services individually:

```bash
# Backend only
cd backend
npm install
npm run dev

# Frontend only
cd frontend
npm install
npm run dev
```

## Branches

- `main` → production
- `staging` → staging environment
- `develop` → development work (feature branches branch off this)

