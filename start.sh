#!/bin/bash

# Covenant Station - Quick Start Script
# This script sets up and starts the PostgreSQL database and API server

echo "🚀 Covenant Station - Quick Start"
echo "=================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start PostgreSQL with Docker Compose
echo "📦 Starting PostgreSQL database..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if database is accessible
until docker exec covenant-db pg_isready -U covenant > /dev/null 2>&1; do
    echo "   Still waiting..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"
echo ""

# Install API dependencies if needed
if [ ! -d "api/node_modules" ]; then
    echo "📥 Installing API dependencies..."
    cd api && npm install && cd ..
    echo "✅ Dependencies installed!"
    echo ""
fi

# Start the API server
echo "🌐 Starting API server..."
cd api
npm run dev &
API_PID=$!
cd ..

echo ""
echo "✨ All services started successfully!"
echo ""
echo "📍 API Server: http://localhost:3001"
echo "📍 Frontend: http://localhost:8000"
echo "📍 Database: localhost:5432"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
trap 'echo ""; echo "🛑 Stopping services..."; kill $API_PID; docker-compose down; echo "✅ All services stopped"; exit 0' INT

wait $API_PID
