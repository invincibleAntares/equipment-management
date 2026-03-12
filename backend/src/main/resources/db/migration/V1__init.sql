-- Flyway migration: schema

CREATE TABLE equipment_types (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE equipment (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  type_id BIGINT NOT NULL REFERENCES equipment_types(id),
  status VARCHAR(32) NOT NULL,
  last_cleaned_date DATE NOT NULL
);

CREATE TABLE maintenance_logs (
  id BIGSERIAL PRIMARY KEY,
  equipment_id BIGINT NOT NULL REFERENCES equipment(id),
  maintenance_date DATE NOT NULL,
  notes TEXT,
  performed_by VARCHAR(120) NOT NULL
);

CREATE INDEX idx_equipment_type_id ON equipment(type_id);
CREATE INDEX idx_maintenance_logs_equipment_id ON maintenance_logs(equipment_id);
CREATE INDEX idx_maintenance_logs_equipment_id_date ON maintenance_logs(equipment_id, maintenance_date DESC);

