#!/bin/bash

# Wait for the database to be ready
until PGPASSWORD=$POSTGRES_PASSWORD psql -h db -U postgres -d $POSTGRES_DB -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
echo "Postgres is up and running!"


# Print all available tables
echo "Available tables:"
PGPASSWORD=$POSTGRES_PASSWORD psql -h db -U postgres -d $POSTGRES_DB -c "\dt"

# Check if the table 'workspaces' exists
table_exists=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h db -U postgres -d $POSTGRES_DB -t -c "SELECT EXISTS (SELECT FROM pg_catalog.pg_tables WHERE tablename = 'workspaces');" | tr -d '[:space:]')

echo "table_exists: $table_exists"


if [ "$table_exists" == "t" ]; then
  echo "Table 'workspaces' already exists. No migration needed."
else
    echo "Table 'workspaces' does not exist. Running migrations..."
  # Run the migrations
  for file in /migrations/*.sql; do
    PGPASSWORD=$POSTGRES_PASSWORD psql -h db -U postgres -d $POSTGRES_DB -f "$file"
  done
fi
