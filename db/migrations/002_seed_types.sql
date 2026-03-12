-- Seed a few equipment types for the dropdown
-- (Schema supports future modification without code changes.)

INSERT INTO equipment_types (name) VALUES
  ('Generator'),
  ('HVAC'),
  ('Laptop'),
  ('Forklift')
ON CONFLICT (name) DO NOTHING;

