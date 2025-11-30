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
npx prisma migrate deploy || npx prisma db push

echo "Starting application..."

exec "$@"

