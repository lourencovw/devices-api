# Devices API

Simple REST API to manage devices (AdonisJS + TypeScript + PostgreSQL).

## Features
- Create, update (partial/full), fetch (single/all), delete devices
- Filter devices by `brand` or `state` via query params
- Domain rules enforced:
  - `created_at` (creationTime) cannot be updated
  - `name` and `brand` cannot be updated when device is `in-use`
  - `in-use` devices cannot be deleted
- Swagger/OpenAPI documentation

## Requirements
- Node 22+
- npm
- Docker & Docker Compose (for easy local PostgreSQL setup)

## Quick Start

### Option 1: Using Docker Compose (Recommended)
This is the easiest way to get started with PostgreSQL locally:

```bash
docker-compose up --build
```

The application will:
- Start a PostgreSQL database on port 5432
- Build and run the API on port 3333
- Automatically run migrations
- Be accessible at `http://localhost:3333`
- View API docs at `http://localhost:3333/docs`

### Option 2: Local Development with Docker Database Only
Start just the PostgreSQL database:

```bash
docker-compose up postgres -d
```

Then install and run the application:
```bash
npm i
cp .env.example .env
node ace generate:key 
node ace migration:run
node ace serve
```

The API will run on `http://localhost:3333` and connect to PostgreSQL on `localhost:5432`.

### Option 3: Manual Setup (Advanced)
If you have PostgreSQL running locally:

1. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your PostgreSQL credentials

3. Install and run:
   ```bash
   npm i
   cp .env.example .env
   node ace generate:key 
   node ace migration:run
   node ace serve
   ```

## Development

### Watch Mode
For development with hot-reload:
```bash
npm run dev
```

### Run Tests
```bash
npm test
```

### Lint & Format
```bash
npm run lint
npm run format
```

## API Endpoints
- `GET /devices` — list devices; supports query params `brand` and `state`
- `GET /devices/:id` — fetch single device
- `POST /devices` — create device (body: `name`, `brand`, optional `state`)
- `PUT|PATCH /devices/:id` — update device (cannot update `createdAt`; name/brand restricted when in-use)
- `DELETE /devices/:id` — delete device (not allowed when `in-use`)

## Swagger Documentation
- **YAML**: `http://localhost:3333/swagger`
- **UI**: `http://localhost:3333/docs`

## Database
- Uses PostgreSQL (configured in `config/database.ts`)
- Default local credentials:
  - Host: `localhost` / `postgres` (in Docker)
  - Port: `5432`
  - User: `root`
  - Password: `root`
  - Database: `app`
- Database migrations run automatically on startup

## Database Credentials (Local)
When using Docker Compose, the following credentials are set up:
- **Username**: `root`
- **Password**: `root`
- **Database**: `app`
- **Port**: `5432`

You can modify these in the `docker-compose.yml` file and `.env.example` as needed.

## Notes & Future Improvements
- Add authentication/authorization mechanisms.
- Implement pagination for list endpoints.
- Add request logging and monitoring.
