-- Flyway migration: seed equipment types

INSERT INTO equipment_types (name) VALUES
  ('Generator'),
  ('HVAC'),
  ('Laptop'),
  ('Forklift')
ON CONFLICT (name) DO NOTHING;

