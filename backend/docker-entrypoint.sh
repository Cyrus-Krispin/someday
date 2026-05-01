#!/bin/sh
# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
while ! nc -z ${DB_HOST:-postgres} 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Run migrations
echo "Running migrations..."
npm run migrate

# Start the application
echo "Starting application..."
exec "$@"
