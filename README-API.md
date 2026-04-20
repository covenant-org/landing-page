# Covenant Station API Setup

This guide will help you set up the PostgreSQL database and API server for the Covenant Station project.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 16+ and npm installed

## Setup Instructions

### 1. Start PostgreSQL Database

From the project root directory, run:

```bash
docker-compose up -d
```

This will:
- Start a PostgreSQL 15 container
- Create the `covenant` database
- Run the schema migrations automatically
- Expose PostgreSQL on port 5432

To check if the database is running:

```bash
docker-compose ps
```

To view database logs:

```bash
docker-compose logs postgres
```

### 2. Install API Dependencies

Navigate to the API directory and install dependencies:

```bash
cd api
npm install
```

### 3. Start the API Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The API server will start on `http://localhost:3001`

### 4. Verify the Setup

Visit `http://localhost:3001/health` in your browser. You should see:

```json
{
  "status": "ok",
  "message": "Covenant API is running"
}
```

## API Endpoints

### Base URL
`http://localhost:3001/api`

### Available Resources

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `GET /api/subscriptions/:id` - Get subscription by ID
- `POST /api/subscriptions` - Create new subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

#### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

#### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

#### Devices
- `GET /api/devices` - Get all devices
- `GET /api/devices/:id` - Get device by ID
- `GET /api/devices/:id/metrics?timeframe=15min` - Get device metrics
- `POST /api/devices` - Create new device
- `POST /api/devices/:id/metrics` - Add device metric
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device

## Database Access

You can connect to the PostgreSQL database using:

```
Host: localhost
Port: 5432
Database: covenant
Username: covenant
Password: covenant123
```

### Using psql CLI

```bash
docker exec -it covenant-db psql -U covenant -d covenant
```

## Stopping the Services

To stop the PostgreSQL database:

```bash
docker-compose down
```

To stop and remove all data:

```bash
docker-compose down -v
```

## Troubleshooting

### Port 5432 already in use

If you have PostgreSQL running locally, either:
1. Stop your local PostgreSQL service
2. Change the port mapping in `docker-compose.yml` (e.g., `"5433:5432"`)

### Database connection errors

1. Make sure Docker is running
2. Check if the container is up: `docker-compose ps`
3. Check logs: `docker-compose logs postgres`
4. Verify connection settings in `api/.env`

### API server won't start

1. Make sure you ran `npm install` in the `api` directory
2. Check if port 3001 is available
3. Verify PostgreSQL is running: `docker-compose ps`
