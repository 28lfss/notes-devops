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
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  npx prisma migrate deploy
else
  echo "No migrations found, using db push for development..."
  npx prisma db push
fi

echo "Starting application..."

exec "$@"

