#!/bin/sh

set -e

echo "Waiting for database to be ready..."

until node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => {
    prisma.\$disconnect();
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
" > /dev/null 2>&1; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"

echo "Running database migrations..."

if [ "${NODE_ENV:-}" = "production" ] || [ "${NODE_ENV:-}" = "staging" ]; then
  echo "Environment is ${NODE_ENV} - running prisma migrate deploy..."
  npx prisma migrate deploy
else
  if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
    echo "Migrations found - running prisma migrate deploy..."
    npx prisma migrate deploy
  else
    echo "No migrations found - running prisma db push (development only)..."
    npx prisma db push
  fi
fi

echo "Starting application..."
exec "$@"
