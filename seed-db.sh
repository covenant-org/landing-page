#!/bin/bash

# Covenant Station - Seed Database Script
# This script loads dummy data into the database

echo "🌱 Seeding database with dummy data..."
echo ""

# Check if Docker container is running
if ! docker ps | grep -q covenant-db; then
    echo "❌ Error: PostgreSQL container is not running."
    echo "   Please start it with: docker compose up -d"
    exit 1
fi

# Load seed data
docker exec -i covenant-db psql -U covenant -d covenant < database/seed.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database seeded successfully!"
    echo ""
    echo "📊 Dummy data created:"
    echo "   - 3 Users (marlon@nuclea.solutions, cristian@nuclea.solutions, eduardo@nuclea.solutions)"
    echo "   - 4 Subscriptions (Active and Inactive)"
    echo "   - 2 Orders"
    echo "   - 6 Invoices"
    echo "   - 1 Device"
    echo ""
else
    echo "❌ Error seeding database. Check the output above for details."
    exit 1
fi
