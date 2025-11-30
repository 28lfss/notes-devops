#!/bin/sh

set -e

echo "Waiting for database to be ready..."

# Wait for database to be available
until prisma db push --skip-generate > /dev/null 2>&1; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
prisma migrate deploy || prisma db push

echo "Starting application..."

# Execute the main command
exec "$@"

