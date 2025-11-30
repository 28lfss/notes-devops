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

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Local Development

1. Clone the repository
2. Set up environment variables
3. Run `docker-compose up` (when available)

## Branches

- `main` → production
- `staging` → staging environment
- `develop` → development work (feature branches branch off this)

