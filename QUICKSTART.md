# Quick Start Guide

Follow these steps to get everything running:

## Step 1: Start Docker

Make sure Docker Desktop is running on your Mac.

## Step 2: Start PostgreSQL Database

```bash
docker compose up -d
```

Wait a few seconds for the database to initialize.

## Step 3: Load Dummy Data

```bash
./seed-db.sh
```

This will create:
- 3 test users
- 4 subscriptions (3 active, 1 inactive)
- 2 orders
- 6 invoices
- 1 device

## Step 4: Install API Dependencies

```bash
cd api
npm install
cd ..
```

## Step 5: Start API Server

```bash
cd api
npm run dev
```

The API will start on http://localhost:3001

## Step 6: Open Your Frontend

In a new terminal, make sure your frontend server is running:

```bash
python3 -m http.server 8000
```

## Step 7: Test It!

Open your browser and go to:
- **Subscriptions Page**: http://localhost:8000/account/subscriptions.html

You should see the 4 dummy subscriptions loaded from the database!

## Troubleshooting

### Docker not running
- Open Docker Desktop application
- Wait for it to fully start (whale icon in menu bar should be stable)

### Port 5432 already in use
- You might have PostgreSQL running locally
- Stop it with: `brew services stop postgresql`

### API won't start
- Make sure you ran `npm install` in the `api` directory
- Check if port 3001 is free

### Can't see data in tables
- Check API is running: http://localhost:3001/health
- Check browser console (F12) for errors
- Verify database has data: `docker exec -it covenant-db psql -U covenant -d covenant -c "SELECT COUNT(*) FROM subscriptions;"`

## Stopping Everything

```bash
# Stop API server
# Press Ctrl+C in the terminal running the API

# Stop PostgreSQL
docker compose down

# Stop frontend server
# Press Ctrl+C in the terminal running python
```
