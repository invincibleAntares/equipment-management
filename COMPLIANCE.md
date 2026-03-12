# Compliance Checklist

This file confirms compliance with the assignment UI + backend requirements.

## UI compliance

### No inline styles
- ✅ Confirmed: **No inline styles** (`style={{ ... }}`) are used in `frontend/src`.

### No raw HTML form elements
- ✅ Confirmed: The application UI does not use raw HTML form elements in app code (`<input>`, `<select>`, `<button>`).
- shadcn/ui components are used instead (examples):
  - `frontend/src/features/equipment/EquipmentFormDialog.jsx`
  - `frontend/src/features/maintenance/MaintenanceLogDialog.jsx`
  - `frontend/src/features/equipment/EquipmentPage.jsx`

### Add and Edit reuse the same form component
- ✅ Confirmed: Add/Edit reuse the same component:
  - `frontend/src/features/equipment/EquipmentFormDialog.jsx`
- Create is triggered from the equipment page with:
  - `mode="create"`
- Edit uses the same dialog with:
  - `mode="edit"`

## Database compliance

### Equipment types are not hardcoded in the database schema
- ✅ Confirmed: Equipment types are stored in a dedicated table:
  - `equipment_types`
- Schema is created by Flyway migration:
  - `backend/src/main/resources/db/migration/V1__init.sql`
- Types are seeded (modifiable without code changes) in:
  - `backend/src/main/resources/db/migration/V2__seed_types.sql`
- The frontend loads types dynamically from:
  - `GET /api/equipment-types`

## Backend compliance (business rules enforced server-side)

### Rule A — Maintenance logging updates equipment (backend)
- ✅ Confirmed: Implemented in backend service logic:
  - `backend/src/main/java/com/example/backend/service/MaintenanceService.java`
- When a maintenance log is created:
  - Equipment status is set to **ACTIVE**
  - Equipment `lastCleanedDate` is updated to the maintenance date

### Rule B — Cannot set ACTIVE if lastCleanedDate is older than 30 days (backend)
- ✅ Confirmed: Enforced in backend service logic:
  - `backend/src/main/java/com/example/backend/service/EquipmentService.java`
- Backend rejects invalid updates with **400 Bad Request** and a meaningful message.
- UI surfaces the backend error message in the form dialogs.

