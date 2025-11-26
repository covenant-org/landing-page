-- Seed Data for Covenant Station
-- Run this in Supabase SQL Editor after schema.sql

-- Clear existing data (optional - comment out if you want to keep existing data)
DELETE FROM device_metrics;
DELETE FROM devices;
DELETE FROM billing_info;
DELETE FROM invoices;
DELETE FROM orders;
DELETE FROM subscriptions;
DELETE FROM users;

-- =====================
-- USERS (10 records)
-- =====================
INSERT INTO users (id, email, name, phone, role, is_owner, shipping_address_line1, shipping_address_line2, shipping_city, shipping_state, shipping_zip, shipping_country) VALUES
  ('11111111-1111-1111-1111-111111111111', 'cristian@covenant.com', 'Cristian Hernandez', '+52 555 123 4567', 'owner', true, 'Mar Mediterraneo 1118', 'Country Club', 'Tijuana', 'Baja California', '22550', 'Mexico'),
  ('22222222-2222-2222-2222-222222222222', 'maria@covenant.com', 'Maria Garcia', '+52 555 234 5678', 'admin', false, 'Av. Revolucion 500', 'Col. Centro', 'Mexico City', 'CDMX', '06000', 'Mexico'),
  ('33333333-3333-3333-3333-333333333333', 'carlos@covenant.com', 'Carlos Rodriguez', '+52 555 345 6789', 'technical', false, 'Calle Reforma 234', NULL, 'Guadalajara', 'Jalisco', '44100', 'Mexico'),
  ('44444444-4444-4444-4444-444444444444', 'ana@covenant.com', 'Ana Martinez', '+52 555 456 7890', 'user', false, 'Blvd. Kukulcan Km 12', 'Zona Hotelera', 'Cancun', 'Quintana Roo', '77500', 'Mexico'),
  ('55555555-5555-5555-5555-555555555555', 'jose@covenant.com', 'Jose Lopez', '+52 555 567 8901', 'technical_configuration', false, 'Av. Insurgentes Sur 1000', NULL, 'Mexico City', 'CDMX', '03100', 'Mexico'),
  ('66666666-6666-6666-6666-666666666666', 'laura@covenant.com', 'Laura Sanchez', '+52 555 678 9012', 'viewer', false, 'Calle Juarez 456', 'Centro Historico', 'Monterrey', 'Nuevo Leon', '64000', 'Mexico'),
  ('77777777-7777-7777-7777-777777777777', 'miguel@covenant.com', 'Miguel Torres', '+52 555 789 0123', 'technical_viewer', false, 'Paseo de la Reforma 222', NULL, 'Mexico City', 'CDMX', '06600', 'Mexico'),
  ('88888888-8888-8888-8888-888888888888', 'sofia@covenant.com', 'Sofia Ramirez', '+52 555 890 1234', 'user', false, 'Av. Chapultepec 100', 'Col. Roma', 'Mexico City', 'CDMX', '06700', 'Mexico'),
  ('99999999-9999-9999-9999-999999999999', 'diego@covenant.com', 'Diego Flores', '+52 555 901 2345', 'admin', false, 'Calle Madero 789', NULL, 'Puebla', 'Puebla', '72000', 'Mexico'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'valentina@covenant.com', 'Valentina Cruz', '+52 555 012 3456', 'user', false, 'Av. Universidad 300', 'Col. Narvarte', 'Mexico City', 'CDMX', '03020', 'Mexico');

-- =====================
-- SUBSCRIPTIONS (10 records)
-- =====================
INSERT INTO subscriptions (id, user_id, subscription_number, nickname, service_location, service_plan, status, ip_policy, monthly_data_gb, data_used_gb, auto_top_up, billing_cycle_start, billing_cycle_end) VALUES
  ('sub11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'SUB-2024-001', 'Home Office', 'Tijuana, BC', 'Residential', 'active', 'dynamic', 1000, 245.50, true, '2024-11-01', '2024-11-30'),
  ('sub22222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'SUB-2024-002', 'Beach House', 'Rosarito, BC', 'Residential Plus', 'active', 'static', 2000, 876.25, true, '2024-11-01', '2024-11-30'),
  ('sub33333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'SUB-2024-003', 'CDMX Office', 'Mexico City, CDMX', 'Business', 'active', 'static', 5000, 2340.00, true, '2024-11-01', '2024-11-30'),
  ('sub44444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'SUB-2024-004', 'Guadalajara HQ', 'Guadalajara, JAL', 'Business Pro', 'active', 'static', 10000, 5678.90, false, '2024-11-01', '2024-11-30'),
  ('sub55555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'SUB-2024-005', 'Cancun Resort', 'Cancun, QR', 'Residential', 'suspended', 'dynamic', 1000, 999.00, false, '2024-11-01', '2024-11-30'),
  ('sub66666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', 'SUB-2024-006', 'Tech Lab', 'Mexico City, CDMX', 'Business', 'active', 'static', 5000, 1234.56, true, '2024-11-01', '2024-11-30'),
  ('sub77777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666', 'SUB-2024-007', 'Monterrey Site', 'Monterrey, NL', 'Residential Plus', 'inactive', 'dynamic', 2000, 0.00, false, '2024-10-01', '2024-10-31'),
  ('sub88888-8888-8888-8888-888888888888', '77777777-7777-7777-7777-777777777777', 'SUB-2024-008', 'Remote Station', 'Mexico City, CDMX', 'Residential', 'active', 'dynamic', 1000, 567.89, true, '2024-11-01', '2024-11-30'),
  ('sub99999-9999-9999-9999-999999999999', '88888888-8888-8888-8888-888888888888', 'SUB-2024-009', 'Roma Office', 'Mexico City, CDMX', 'Business', 'active', 'static', 5000, 3456.78, true, '2024-11-01', '2024-11-30'),
  ('subaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '99999999-9999-9999-9999-999999999999', 'SUB-2024-010', 'Puebla Branch', 'Puebla, PUE', 'Residential', 'cancelled', 'dynamic', 1000, 123.45, false, '2024-09-01', '2024-09-30');

-- =====================
-- ORDERS (10 records)
-- =====================
INSERT INTO orders (id, user_id, order_number, order_date, status, item_name, item_description, tracking_number, tracking_url, estimated_delivery, total_amount, subtotal, tax, shipping_cost, shipping_address, items) VALUES
  ('ord11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'ORD-5549304-70292-45', '2024-07-12', 'delivered', 'Starlink Standard Actuated Kit', 'Complete Starlink kit with dish and router', 'TRK-001-2024', 'https://tracking.example.com/TRK-001-2024', '2024-07-20', 12477.42, 9054.66, 2002.76, 1420.00, 'Mar Mediterraneo 1118, Country Club, Tijuana, BC 22550', '[{"id": "item-1", "name": "Starlink Standard Actuated Kit", "item_id": "STL-STD-001", "price": 9054.66, "status": "delivered", "image_url": null}]'),
  ('ord22222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'ORD-5549304-70293-46', '2024-09-15', 'shipped', 'Starlink Mesh Node', 'WiFi mesh extender for larger coverage', 'TRK-002-2024', 'https://tracking.example.com/TRK-002-2024', '2024-09-25', 3500.00, 2800.00, 448.00, 252.00, 'Mar Mediterraneo 1118, Country Club, Tijuana, BC 22550', '[{"id": "item-2", "name": "Starlink Mesh Node", "item_id": "STL-MESH-001", "price": 2800.00, "status": "shipped", "image_url": null}]'),
  ('ord33333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'ORD-5549304-70294-47', '2024-10-01', 'processing', 'Starlink Business Kit', 'High-performance business satellite kit', 'TRK-003-2024', 'https://tracking.example.com/TRK-003-2024', '2024-10-15', 62500.00, 50000.00, 8000.00, 4500.00, 'Av. Revolucion 500, Col. Centro, Mexico City, CDMX 06000', '[{"id": "item-3", "name": "Starlink Business Kit", "item_id": "STL-BIZ-001", "price": 50000.00, "status": "processing", "image_url": null}]'),
  ('ord44444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'ORD-5549304-70295-48', '2024-10-20', 'delivered', 'Starlink Standard Kit', 'Standard residential satellite kit', 'TRK-004-2024', 'https://tracking.example.com/TRK-004-2024', '2024-10-28', 11000.00, 8800.00, 1408.00, 792.00, 'Calle Reforma 234, Guadalajara, JAL 44100', '[{"id": "item-4", "name": "Starlink Standard Kit", "item_id": "STL-STD-002", "price": 8800.00, "status": "delivered", "image_url": null}]'),
  ('ord55555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'ORD-5549304-70296-49', '2024-11-01', 'shipped', 'Starlink RV Kit', 'Portable satellite kit for mobile use', 'TRK-005-2024', 'https://tracking.example.com/TRK-005-2024', '2024-11-10', 14500.00, 11600.00, 1856.00, 1044.00, 'Blvd. Kukulcan Km 12, Zona Hotelera, Cancun, QR 77500', '[{"id": "item-5", "name": "Starlink RV Kit", "item_id": "STL-RV-001", "price": 11600.00, "status": "shipped", "image_url": null}]'),
  ('ord66666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', 'ORD-5549304-70297-50', '2024-11-05', 'processing', 'Starlink Flat High Performance', 'High performance flat antenna', 'TRK-006-2024', 'https://tracking.example.com/TRK-006-2024', '2024-11-18', 31250.00, 25000.00, 4000.00, 2250.00, 'Av. Insurgentes Sur 1000, Mexico City, CDMX 03100', '[{"id": "item-6", "name": "Starlink Flat High Performance", "item_id": "STL-FHP-001", "price": 25000.00, "status": "processing", "image_url": null}]'),
  ('ord77777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666', 'ORD-5549304-70298-51', '2024-11-08', 'cancelled', 'Starlink Mini', 'Compact portable satellite kit', NULL, NULL, NULL, 8750.00, 7000.00, 1120.00, 630.00, 'Calle Juarez 456, Centro Historico, Monterrey, NL 64000', '[{"id": "item-7", "name": "Starlink Mini", "item_id": "STL-MINI-001", "price": 7000.00, "status": "cancelled", "image_url": null}]'),
  ('ord88888-8888-8888-8888-888888888888', '77777777-7777-7777-7777-777777777777', 'ORD-5549304-70299-52', '2024-11-10', 'shipped', 'Starlink Ethernet Adapter', 'Ethernet adapter for wired connections', 'TRK-008-2024', 'https://tracking.example.com/TRK-008-2024', '2024-11-15', 875.00, 700.00, 112.00, 63.00, 'Paseo de la Reforma 222, Mexico City, CDMX 06600', '[{"id": "item-8", "name": "Starlink Ethernet Adapter", "item_id": "STL-ETH-001", "price": 700.00, "status": "shipped", "image_url": null}]'),
  ('ord99999-9999-9999-9999-999999999999', '88888888-8888-8888-8888-888888888888', 'ORD-5549304-70300-53', '2024-11-12', 'processing', 'Starlink Cable 75ft', 'Extended cable for dish placement', 'TRK-009-2024', 'https://tracking.example.com/TRK-009-2024', '2024-11-20', 1250.00, 1000.00, 160.00, 90.00, 'Av. Chapultepec 100, Col. Roma, Mexico City, CDMX 06700', '[{"id": "item-9", "name": "Starlink Cable 75ft", "item_id": "STL-CBL-75", "price": 1000.00, "status": "processing", "image_url": null}]'),
  ('ordaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '99999999-9999-9999-9999-999999999999', 'ORD-5549304-70301-54', '2024-11-15', 'delivered', 'Starlink Pipe Adapter', 'Mounting adapter for pole installation', 'TRK-010-2024', 'https://tracking.example.com/TRK-010-2024', '2024-11-22', 625.00, 500.00, 80.00, 45.00, 'Calle Madero 789, Puebla, PUE 72000', '[{"id": "item-10", "name": "Starlink Pipe Adapter", "item_id": "STL-PIPE-001", "price": 500.00, "status": "delivered", "image_url": null}]');

-- =====================
-- INVOICES (10 records)
-- =====================
INSERT INTO invoices (id, user_id, subscription_id, invoice_number, invoice_date, due_date, description, payment_method, total_amount, balance_due, status, pdf_url) VALUES
  ('inv11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'sub11111-1111-1111-1111-111111111111', 'INV-DF-MEX-4995798-68810', '2024-10-27', '2024-11-26', 'Monthly Subscription - Residential', 'credit_card', 1199.00, 0.00, 'paid', 'https://invoices.example.com/INV-DF-MEX-4995798-68810.pdf'),
  ('inv22222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'sub22222-2222-2222-2222-222222222222', 'INV-DF-MEX-4995798-68811', '2024-10-27', '2024-11-26', 'Monthly Subscription - Residential Plus', 'credit_card', 1899.00, 0.00, 'paid', 'https://invoices.example.com/INV-DF-MEX-4995798-68811.pdf'),
  ('inv33333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'sub33333-3333-3333-3333-333333333333', 'INV-DF-MEX-4995798-68812', '2024-10-27', '2024-11-26', 'Monthly Subscription - Business', 'credit_card', 4500.00, 0.00, 'paid', 'https://invoices.example.com/INV-DF-MEX-4995798-68812.pdf'),
  ('inv44444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'sub44444-4444-4444-4444-444444444444', 'INV-DF-MEX-4995798-68813', '2024-11-01', '2024-11-30', 'Monthly Subscription - Business Pro', 'bank_transfer', 8500.00, 8500.00, 'unpaid', 'https://invoices.example.com/INV-DF-MEX-4995798-68813.pdf'),
  ('inv55555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'sub55555-5555-5555-5555-555555555555', 'INV-DF-MEX-4995798-68814', '2024-09-27', '2024-10-26', 'Monthly Subscription - Residential', 'credit_card', 1199.00, 1199.00, 'overdue', 'https://invoices.example.com/INV-DF-MEX-4995798-68814.pdf'),
  ('inv66666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', 'sub66666-6666-6666-6666-666666666666', 'INV-DF-MEX-4995798-68815', '2024-10-27', '2024-11-26', 'Monthly Subscription - Business', 'credit_card', 4500.00, 0.00, 'paid', 'https://invoices.example.com/INV-DF-MEX-4995798-68815.pdf'),
  ('inv77777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666', 'sub77777-7777-7777-7777-777777777777', 'INV-DF-MEX-4995798-68816', '2024-09-27', '2024-10-26', 'Monthly Subscription - Residential Plus', 'credit_card', 1899.00, 0.00, 'cancelled', NULL),
  ('inv88888-8888-8888-8888-888888888888', '77777777-7777-7777-7777-777777777777', 'sub88888-8888-8888-8888-888888888888', 'INV-DF-MEX-4995798-68817', '2024-10-27', '2024-11-26', 'Monthly Subscription - Residential', 'credit_card', 1199.00, 0.00, 'paid', 'https://invoices.example.com/INV-DF-MEX-4995798-68817.pdf'),
  ('inv99999-9999-9999-9999-999999999999', '88888888-8888-8888-8888-888888888888', 'sub99999-9999-9999-9999-999999999999', 'INV-DF-MEX-4995798-68818', '2024-11-01', '2024-11-30', 'Monthly Subscription - Business', 'credit_card', 4500.00, 4500.00, 'unpaid', 'https://invoices.example.com/INV-DF-MEX-4995798-68818.pdf'),
  ('invaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '99999999-9999-9999-9999-999999999999', 'subaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'INV-DF-MEX-4995798-68819', '2024-08-27', '2024-09-26', 'Monthly Subscription - Residential', 'credit_card', 1199.00, 0.00, 'paid', 'https://invoices.example.com/INV-DF-MEX-4995798-68819.pdf');

-- =====================
-- DEVICES (10 records)
-- =====================
INSERT INTO devices (id, user_id, subscription_id, device_type, device_name, starlink_id, serial_number, kit_number, software_version, status, uptime_seconds, last_updated) VALUES
  ('dev11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'sub11111-1111-1111-1111-111111111111', 'Starlink Standard Actuated', 'Home Office Dish', 'STL-2024-001', 'SN-ABC123456', 'KIT-2024-001', '2024.48.0', 'online', 2592000, '2024-11-25 10:30:00+00'),
  ('dev22222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'sub22222-2222-2222-2222-222222222222', 'Starlink Standard Actuated', 'Beach House Dish', 'STL-2024-002', 'SN-DEF234567', 'KIT-2024-002', '2024.48.0', 'online', 1728000, '2024-11-25 10:25:00+00'),
  ('dev33333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'sub33333-3333-3333-3333-333333333333', 'Starlink High Performance', 'CDMX Office Dish', 'STL-2024-003', 'SN-GHI345678', 'KIT-2024-003', '2024.47.0', 'online', 864000, '2024-11-25 10:20:00+00'),
  ('dev44444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'sub44444-4444-4444-4444-444444444444', 'Starlink High Performance', 'Guadalajara HQ Dish', 'STL-2024-004', 'SN-JKL456789', 'KIT-2024-004', '2024.48.0', 'stowed', 0, '2024-11-24 18:00:00+00'),
  ('dev55555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'sub55555-5555-5555-5555-555555555555', 'Starlink Standard', 'Cancun Resort Dish', 'STL-2024-005', 'SN-MNO567890', 'KIT-2024-005', '2024.46.0', 'offline', 0, '2024-11-20 12:00:00+00'),
  ('dev66666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', 'sub66666-6666-6666-6666-666666666666', 'Starlink Flat High Performance', 'Tech Lab Dish', 'STL-2024-006', 'SN-PQR678901', 'KIT-2024-006', '2024.48.0', 'online', 432000, '2024-11-25 10:15:00+00'),
  ('dev77777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666', 'sub77777-7777-7777-7777-777777777777', 'Starlink Standard', 'Monterrey Site Dish', 'STL-2024-007', 'SN-STU789012', 'KIT-2024-007', '2024.45.0', 'offline', 0, '2024-10-31 23:59:00+00'),
  ('dev88888-8888-8888-8888-888888888888', '77777777-7777-7777-7777-777777777777', 'sub88888-8888-8888-8888-888888888888', 'Starlink Standard', 'Remote Station Dish', 'STL-2024-008', 'SN-VWX890123', 'KIT-2024-008', '2024.48.0', 'updating', 86400, '2024-11-25 09:00:00+00'),
  ('dev99999-9999-9999-9999-999999999999', '88888888-8888-8888-8888-888888888888', 'sub99999-9999-9999-9999-999999999999', 'Starlink High Performance', 'Roma Office Dish', 'STL-2024-009', 'SN-YZA901234', 'KIT-2024-009', '2024.48.0', 'online', 1296000, '2024-11-25 10:10:00+00'),
  ('devaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '99999999-9999-9999-9999-999999999999', 'subaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Starlink Standard', 'Puebla Branch Dish', 'STL-2024-010', 'SN-BCD012345', 'KIT-2024-010', '2024.44.0', 'offline', 0, '2024-09-30 23:59:00+00');

-- =====================
-- DEVICE METRICS (10 records - various metrics for different devices)
-- =====================
INSERT INTO device_metrics (id, device_id, metric_type, value, unit, recorded_at) VALUES
  ('met11111-1111-1111-1111-111111111111', 'dev11111-1111-1111-1111-111111111111', 'download_speed', 185.50, 'Mbps', '2024-11-25 10:30:00+00'),
  ('met22222-2222-2222-2222-222222222222', 'dev11111-1111-1111-1111-111111111111', 'upload_speed', 25.75, 'Mbps', '2024-11-25 10:30:00+00'),
  ('met33333-3333-3333-3333-333333333333', 'dev11111-1111-1111-1111-111111111111', 'latency', 32.50, 'ms', '2024-11-25 10:30:00+00'),
  ('met44444-4444-4444-4444-444444444444', 'dev22222-2222-2222-2222-222222222222', 'download_speed', 220.00, 'Mbps', '2024-11-25 10:25:00+00'),
  ('met55555-5555-5555-5555-555555555555', 'dev33333-3333-3333-3333-333333333333', 'download_speed', 350.00, 'Mbps', '2024-11-25 10:20:00+00'),
  ('met66666-6666-6666-6666-666666666666', 'dev33333-3333-3333-3333-333333333333', 'uptime_percent', 99.95, '%', '2024-11-25 10:20:00+00'),
  ('met77777-7777-7777-7777-777777777777', 'dev66666-6666-6666-6666-666666666666', 'signal_quality', 92.50, '%', '2024-11-25 10:15:00+00'),
  ('met88888-8888-8888-8888-888888888888', 'dev88888-8888-8888-8888-888888888888', 'download_speed', 145.00, 'Mbps', '2024-11-25 09:00:00+00'),
  ('met99999-9999-9999-9999-999999999999', 'dev99999-9999-9999-9999-999999999999', 'download_speed', 310.00, 'Mbps', '2024-11-25 10:10:00+00'),
  ('metaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dev99999-9999-9999-9999-999999999999', 'latency', 28.00, 'ms', '2024-11-25 10:10:00+00');

-- =====================
-- BILLING INFO (10 records)
-- =====================
INSERT INTO billing_info (id, user_id, cardholder_name, card_last_four, card_type, expiry_month, expiry_year, billing_cycle_day, available_credits, is_primary) VALUES
  ('bil11111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Cristian Hernandez', '6985', 'mastercard', 12, 2029, 27, 250.00, true),
  ('bil22222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Maria Garcia', '4521', 'visa', 8, 2027, 15, 0.00, true),
  ('bil33333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Carlos Rodriguez', '7890', 'amex', 3, 2026, 1, 125.50, true),
  ('bil44444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Ana Martinez', '1234', 'visa', 11, 2028, 20, 0.00, true),
  ('bil55555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Jose Lopez', '5678', 'mastercard', 6, 2027, 10, 500.00, true),
  ('bil66666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Laura Sanchez', '9012', 'discover', 9, 2026, 5, 75.25, true),
  ('bil77777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'Miguel Torres', '3456', 'visa', 2, 2029, 28, 0.00, true),
  ('bil88888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'Sofia Ramirez', '7891', 'mastercard', 7, 2028, 12, 1000.00, true),
  ('bil99999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'Diego Flores', '2345', 'amex', 4, 2027, 18, 50.00, true),
  ('bilaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Valentina Cruz', '6789', 'visa', 10, 2026, 25, 0.00, true);
