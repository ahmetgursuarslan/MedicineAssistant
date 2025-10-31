<div align="center">

# 🩺 Medicine Assistant Backend

Robust, modular, and production‑ready REST API for managing medicines, companies, user health context (diseases & allergens), dosage timers, and automated reminders – built with NestJS 10, PostgreSQL, TypeORM, BullMQ, and modern backend best practices (DTO mapping, layered architecture, scheduling, structured logging, OpenAPI, and test coverage targets).

</div>

## ✨ Core Purpose
Provide a backend service that helps users and healthcare-related applications:
1. Register & authenticate securely (JWT based)
2. Manage personal health context (diseases, allergens)
3. Store medicine and prospectus (leaflet) data
4. Detect potential risk interactions between a user's profile and a medicine
5. Schedule dosage timers and generate reminders automatically
6. Queue and process reminders asynchronously (dispatch lifecycle)
7. Offer a clean, well-documented API surface (Swagger/OpenAPI)
8. Maintain observability & resilience (Pino logging, PostgreSQL error mapping, throttling & security middleware)

## 🧱 Architecture Overview
Feature‑first modular structure:

```
src/
	auth/            # Authentication & JWT handling
	users/           # User entity + registration/login/me
	companies/       # Companies linked to users
	diseases/        # Disease catalog per user
	allergens/       # Allergen catalog per user
	medicines/       # Medicines + prospectus text
	timers/          # Planned dosage timers
	reminders/       # Generated reminders (cron + queue lifecycle)
	risk/            # Risk analysis (prospectus vs user profile)
	common/          # Shared filters, mappers, utilities
	db/              # Migration/seed runners
	openapi/         # OpenAPI generation script
```

Principles:
- Strict DTO <-> Entity mapping (no raw entity leakage)
- Validation everywhere (class-validator + global ValidationPipe)
- Config-driven environment (Joi schema validation)
- Persistence via TypeORM 0.3 (migrations only; synchronize disabled)
- Scheduling via `@nestjs/schedule`
- Asynchronous workloads with BullMQ (Redis)
- Structured logs (Pino + pino-http)
- Global PostgreSQL error filter (unique & FK constraint clarity)
- Security middleware: Helmet, Rate limiting (Throttler), CORS

## 🛠 Technology Stack
| Layer | Tools |
|-------|-------|
| Runtime | Node.js >= 18 |
| Framework | NestJS 10 |
| Database | PostgreSQL (prod) / SQLite in-memory (OpenAPI generation fallback) |
| ORM | TypeORM 0.3 (DataSource + migrations) |
| Queue | BullMQ + Redis |
| Scheduling | @nestjs/schedule |
| Auth | JWT (access + refresh groundwork), bcrypt |
| Validation | class-validator / class-transformer |
| Config | @nestjs/config + Joi |
| Docs | @nestjs/swagger + Swagger UI |
| Logging | Pino + pino-http |
| Testing | Jest (unit + e2e), Supertest |

## 📦 Installation
```bash
git clone https://github.com/ahmetgursuarslan/MedicineAssistant.git
cd MedicineAssistant
npm install
```

## ⚙️ Environment Variables
Create a `.env` file (validated by Joi). Example:
```
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=medicine_db
DB_LOGGING=false

# Auth
JWT_SECRET=super-secret-change-me
JWT_EXPIRES_IN=15m
REFRESH_SECRET=another-secret-change-me
REFRESH_EXPIRES_IN=7d

# Redis (for BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379

# Logging
LOG_LEVEL=info
```

## ▶️ Running the App
Development (watch mode):
```bash
npm run start:dev
```
Production (after build):
```bash
npm run build
npm run start:prod
```

API base path: `http://localhost:3000/api/v1`

Swagger UI (if enabled at runtime): `http://localhost:3000/api-docs`

## 📄 Accessing OpenAPI (Swagger) UI

Once the application is running (e.g., via `npm start` or `docker compose up`):

-   **Default URL:** Open your browser and navigate to `http://localhost:3000/api-docs`.
-   **Custom Port:** If you've configured the application to run on a different port (e.g., by setting the `PORT` environment variable), adjust the URL accordingly (e.g., `http://localhost:3001/api-docs`).

This interactive documentation allows you to explore the API endpoints, their parameters, and expected responses.

### 🐳 Run with Docker (recommended)

1) Create your env file by copying `.env.example` to `.env` and adjust values if needed.
	- By default, the compose file wires the app to `db` and `redis` services.
2) Build and start all services:

```bash
docker compose up --build
```

3) App will be available at:

```
http://localhost:3000
```

To stop:

```bash
docker compose down
```

## 🗄 Database Lifecycle
All schema changes handled via migrations (no `synchronize`).

Run migrations:
```bash
npm run db:migrate
```
Revert last migration:
```bash
npm run db:revert
```
Seed baseline data:
```bash
npm run db:seed
```

## 🧪 Testing
Unit tests:
```bash
npm test
```
Watch mode:
```bash
npm run test:watch
```
Coverage (threshold 80%):
```bash
npm run test:cov
```
End‑to‑end tests:
```bash
npm run test:e2e
```

## 🔐 Authentication Flow
Implemented:
- User registration
- Login -> JWT access token (and refresh token placeholder)
- Protected routes via bearer auth

Planned Enhancements:
- Refresh token rotation & revocation
- Role-based route guards (admin / user)

## 🧾 Modules & Responsibilities (Summary)
- Auth: JWT strategy, guards, hashing
- Users: CRUD (limited exposure), registration, profile
- Companies: Entities owned by a user
- Diseases / Allergens: User medical context
- Medicines: Medicine + prospectus content storage
- Risk: Textual scan comparing prospectus vs user allergens/diseases
- Timers: Structured dosage plan definitions
- Reminders: Generated instances from timers per schedule
- Queue (Reminders): Lifecycle transitions (PLANNED → QUEUED → SENT)

## ⏰ Scheduling & Reminders
Two cron jobs:
1. Planner (daily): Generates 7‑day rolling reminders from active timers
2. Enqueuer (every 5m): Pushes due reminders into BullMQ for processing

Worker consumes queue and marks reminders as SENT (placeholder for integration with real notification channels like email/push/SMS).

## 📄 OpenAPI Generation
The app exposes live Swagger UI. A static spec can be generated via:
```bash
GENERATE_OPENAPI=true npm run generate:openapi
```
During generation an in‑memory SQLite adapter is used to avoid impacting or requiring a running PostgreSQL instance.

Output (default): `openapi-spec.json` (path may be adjusted in `src/openapi/generate-spec.ts`).

## 📝 Logging & Error Handling
- Pino structured logs with pretty transport in non‑production.
- Request logging via `pino-http` (method, url, id, status).
- Global PostgreSQL exception filter maps errors:
	- 23505 -> Unique constraint conflict (409)
	- 23503 -> Foreign key violation (400)
- Global ValidationPipe: whitelist + forbid unknown + transformation.

## 🛡 Security
- Helmet for baseline hardening
- Throttler: 100 requests / 15 min per IP (configurable)
- CORS enabled (configure origins before production)
- JWT bearer auth on protected endpoints

## 🧰 NPM Scripts (Key)
| Script | Purpose |
|--------|---------|
| start:dev | Run in watch mode |
| build | Compile TypeScript + generate OpenAPI |
| start:prod | Run compiled build |
| db:migrate | Apply migrations |
| db:revert | Revert last migration |
| db:seed | Seed baseline data |
| test / test:cov / test:e2e | Test workflows |
| generate:openapi | Standalone OpenAPI spec export |
| lint / format | Code quality & formatting |

## 🧭 Roadmap
- [ ] Fix standalone OpenAPI generation edge cases (bootstrap exit)
- [x] Add refresh token rotation & revocation store
- [x] Add Dockerfile + docker-compose (Postgres + Redis + app)
- [x] Add comprehensive health check endpoint for all services and DB connectivity
- [ ] CI pipeline (lint, test, coverage gate, build, spec artifact)
- [ ] Index & full‑text search (GIN + ts_vector on prospectus)
- [x] Notification channel adapters (email / push abstraction) - *implemented queue system*
- [ ] Additional health analytics endpoints
- [ ] Role-based authorization enforcement

## 🧪 Suggested Test Coverage Areas
- Auth service (hash, validate, token issue)
- Risk analysis edge cases (no matches, allergen subset, case insensitivity)
- Reminder planner (date boundaries, daylight savings, duplicates prevention)
- Queue worker (state transitions)
- DTO validation failures (bad payload schemas)

## 🤝 Contributing
1. Fork & clone
2. Create feature branch: `git checkout -b feat/something`
3. Run `npm run lint && npm run test`
4. Submit PR (ensure OpenAPI builds locally if modified)

## 🧾 License
MIT – see `LICENSE` file.

## 📣 Notes
This backend is under active development; certain features (refresh rotation, FTS, Docker/CI) are intentionally staged. Feedback and issues are welcome.

---
Happy building! 🧪💊
