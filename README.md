# Equipment Management System (EMS)

Monorepo web app to manage equipment and its maintenance lifecycle (equipment CRUD + maintenance logs).

Repo root contains: `/backend`, `/frontend`, `/db`. The assignment also requires `COMPLIANCE.md` (added at the end of the submission).

## Tech stack
- **Backend**: Java 17, Spring Boot, Spring Web, Spring Data JPA, Flyway, PostgreSQL
- **Frontend**: React (Vite), Tailwind CSS, **shadcn/ui**
- **DB**: PostgreSQL tables `equipment_types` → `equipment` → `maintenance_logs`

## Features
- Equipment list in a **table**
- Add / Edit (shared form) / Delete equipment
- Equipment type dropdown is **dynamic from DB** (`GET /api/equipment-types`)
- Maintenance logging + maintenance history per equipment
- Backend-enforced rules:
  - **Rule A**: when maintenance is logged, equipment becomes **ACTIVE** and `lastCleanedDate` updates to `maintenanceDate`
  - **Rule B**: equipment cannot be set **ACTIVE** if `lastCleanedDate` is older than **30 days** (backend rejects; UI shows message)
- Bonus (client-side): status filter + search
- Delete safety:
  - `DELETE /api/equipment/{id}` returns **409** if maintenance exists
  - UI then offers **Delete anyway** → `DELETE /api/equipment/{id}?force=true` (deletes logs then equipment)

## API (backend)
- `GET /api/equipment-types`
- `GET /api/equipment`
- `POST /api/equipment`
- `PUT /api/equipment/{id}`
- `DELETE /api/equipment/{id}` (optional `?force=true`)
- `POST /api/maintenance`
- `GET /api/equipment/{id}/maintenance`

## Database schema (quick view)

**`equipment_types`**
- `id` (PK)
- `name` (unique)

**`equipment`**
- `id` (PK)
- `name`
- `type_id` (FK → `equipment_types.id`)
- `status`
- `last_cleaned_date`

**`maintenance_logs`**
- `id` (PK)
- `equipment_id` (FK → `equipment.id`)
- `maintenance_date`
- `notes`
- `performed_by`

Relationships:
- `equipment_types` → `equipment` (one-to-many)
- `equipment` → `maintenance_logs` (one-to-many)

## Folder structure

### Backend (`/backend`)

```text
backend/
  pom.xml
  src/
    main/
      java/com/example/backend/
        api/                 # Controllers (REST endpoints)
          EquipmentController.java
          EquipmentTypeController.java
          MaintenanceController.java
          dto/               # Request/response DTOs
        service/             # Business rules (Rule A / Rule B) + orchestration
        repository/          # Spring Data JPA repositories
        domain/              # JPA entities + EquipmentStatus enum
        exception/           # ApiErrorResponse + GlobalExceptionHandler
        config/              # CORS + Clock bean
      resources/
        application.properties
        db/migration/        # Flyway migrations (V1 schema, V2 seed types)
    test/
      java/                  # Lightweight unit tests
      resources/             # Test config (H2)
```

### Frontend (`/frontend`)

```text
frontend/
  package.json
  components.json            # shadcn/ui config
  vite.config.js
  src/
    api/                     # fetch wrappers for backend routes
      client.js
      equipment.js
    components/ui/           # shadcn/ui generated components
    features/
      equipment/
        EquipmentPage.jsx
        EquipmentFormDialog.jsx
      maintenance/
        MaintenanceHistoryDialog.jsx
        MaintenanceLogDialog.jsx
    lib/
      utils.js               # cn() helper
    App.jsx
    main.jsx
    index.css
```

## Project structure (high level)

```text
/
  backend/   # Spring Boot API
  frontend/  # React UI
  db/        # reference SQL scripts (Flyway runs from backend resources)
```

## Local setup

### Prerequisites
- **Java 17+** (backend)
- **Node.js + npm** (frontend)
- **PostgreSQL** running locally

### Database (PostgreSQL)
Create a DB named `equipment_dp` (default).

If you use pgAdmin, create a database called `equipment_dp`.

Flyway migrations auto-run from:
- `backend/src/main/resources/db/migration`

### Backend (Windows / PowerShell)
Defaults in `backend/src/main/resources/application.properties`:
- `DB_URL=jdbc:postgresql://localhost:5432/equipment_dp`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=admin`
- `PORT=8080`

Run:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:8080`

## Example API requests

Create equipment:

```bash
curl -X POST "http://localhost:8080/api/equipment" -H "Content-Type: application/json" -d "{\"name\":\"Drill Machine\",\"typeId\":1,\"status\":\"INACTIVE\",\"lastCleanedDate\":\"2026-03-13\"}"
```

Log maintenance (Rule A will set equipment ACTIVE + update lastCleanedDate):

```bash
curl -X POST "http://localhost:8080/api/maintenance" -H "Content-Type: application/json" -d "{\"equipmentId\":1,\"maintenanceDate\":\"2026-03-13\",\"notes\":\"Cleaned filters\",\"performedBy\":\"John\"}"
```

Force delete equipment (deletes logs first):

```bash
curl -X DELETE "http://localhost:8080/api/equipment/1?force=true"
```

## Useful commands

### Backend tests

```powershell
cd backend
.\mvnw.cmd test
```

### Frontend lint/build

```powershell
cd frontend
npm run lint
npm run build
```

## Troubleshooting

### Backend can’t connect to Postgres
- Confirm Postgres is running on `localhost:5432`
- Confirm DB exists: `equipment_dp`
- Confirm credentials match `application.properties` (default password is `admin`)

### Flyway / schema issues
Backend uses Flyway migrations. If you manually edited tables, the easiest reset is:
- drop the DB and recreate it, then restart backend (Flyway will recreate schema)

## Additional libraries used

Backend:
- **Flyway**: database migrations + seed data
- **H2 (test scope)**: allows `mvn test` without requiring PostgreSQL

Frontend:
- **shadcn/ui**: UI component generator/components
- **@base-ui/react**: primitives used by shadcn v4 components
- **lucide-react**: icons
- **tw-animate-css**: animations used by shadcn styles
- **class-variance-authority / clsx / tailwind-merge**: className composition utilities
- **@fontsource-variable/geist**: UI font

## Assumptions
- Equipment types are stored in the database and seeded using Flyway migrations.
- Maintenance logs are immutable once created (no edit endpoint/UI).
- Backend is the source of truth for enforcing business rules (Rule A and Rule B).
- Equipment with maintenance history cannot be deleted unless `force=true` is used.
- Equipment types can be modified directly in the database without requiring code changes.