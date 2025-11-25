-- Covenant Database Seed Data
-- This file contains dummy data for testing

-- Insert test users
INSERT INTO users (email, name, phone, role, shipping_address_line1, shipping_city, shipping_state, shipping_zip, shipping_country)
VALUES
  ('marlon@nuclea.solutions', 'Marlon Espinosa Perez', '+523331298269', 'admin', 'Mar Mediterraneo 1118, Country club', 'GUADALAJARA', 'JA', '44610', 'MX'),
  ('cristian@nuclea.solutions', 'Cristian Hernandez', '+523312345678', 'admin', 'Av. Principal 123', 'GUADALAJARA', 'JA', '44100', 'MX'),
  ('eduardo@nuclea.solutions', 'Eduardo Martinez', '+523319876543', 'admin', 'Calle Secundaria 456', 'ZAPOPAN', 'JA', '45000', 'MX')
ON CONFLICT (email) DO NOTHING;

-- Insert test subscriptions
INSERT INTO subscriptions (user_id, subscription_number, nickname, service_location, service_plan, status, monthly_data_gb, data_used_gb, billing_cycle_start, billing_cycle_end)
SELECT
  u.id,
  'SL-2454598-92551-84',
  'Covenant pruebas en sitio',
  'Centro de diseño avanzado, Valle Real, 45019 Zapopan, Jal., Mexico',
  'Local Priority Subscription',
  'active',
  350,
  302.5,
  '2025-10-27',
  '2025-11-26'
FROM users u WHERE u.email = 'marlon@nuclea.solutions'
ON CONFLICT (subscription_number) DO NOTHING;

INSERT INTO subscriptions (user_id, subscription_number, nickname, service_location, service_plan, status, monthly_data_gb, data_used_gb)
SELECT
  u.id,
  'SL-1234567-89012-34',
  'Starlink Mini Marlon',
  'Mar Mediterráneo 1118, Country Club, 44610 Guadalajara, Jal., Mexico',
  'Mobile Priority',
  'active',
  350,
  125.0
FROM users u WHERE u.email = 'marlon@nuclea.solutions'
ON CONFLICT (subscription_number) DO NOTHING;

INSERT INTO subscriptions (user_id, subscription_number, nickname, service_location, service_plan, status, monthly_data_gb, data_used_gb)
SELECT
  u.id,
  'SL-9876543-21098-76',
  'Covenant Oficina',
  'Vía sin nombre, Guadalajara, JAL',
  'Standard',
  'active',
  1000,
  450.0
FROM users u WHERE u.email = 'cristian@nuclea.solutions'
ON CONFLICT (subscription_number) DO NOTHING;

INSERT INTO subscriptions (user_id, subscription_number, nickname, service_location, service_plan, status, monthly_data_gb, data_used_gb)
SELECT
  u.id,
  'SL-5555555-55555-55',
  'Madre Tierra',
  'Vía sin nombre',
  'Standard',
  'inactive',
  350,
  0.0
FROM users u WHERE u.email = 'eduardo@nuclea.solutions'
ON CONFLICT (subscription_number) DO NOTHING;

-- Insert test orders
INSERT INTO orders (user_id, order_number, order_date, status, item_name, item_description, tracking_number, estimated_delivery, total_amount)
SELECT
  u.id,
  'ORD-55493D4-70292-45',
  '2022-07-12',
  'shipped',
  'Starlink Standard Actuated Kit',
  'Complete Starlink kit with dish, router, cables, and mounting hardware',
  'ORD-55493D4-70292-45',
  NULL,
  15999.00
FROM users u WHERE u.email = 'marlon@nuclea.solutions'
ON CONFLICT (order_number) DO NOTHING;

INSERT INTO orders (user_id, order_number, order_date, status, item_name, item_description, tracking_number, estimated_delivery, total_amount)
SELECT
  u.id,
  'ORD-66666D6-80303-56',
  '2025-03-15',
  'delivered',
  'Starlink Mini Kit',
  'Compact Starlink Mini with portable setup',
  'TRK-987654321',
  '2025-03-20',
  9999.00
FROM users u WHERE u.email = 'cristian@nuclea.solutions'
ON CONFLICT (order_number) DO NOTHING;

-- Insert test invoices
INSERT INTO invoices (user_id, subscription_id, invoice_number, invoice_date, due_date, description, payment_method, total_amount, balance_due, status)
SELECT
  u.id,
  s.id,
  'INV-DF-MEX-4995798-68810-39',
  '2025-10-27',
  '2025-10-26',
  'Subscription',
  'Card',
  4835.00,
  0.00,
  'paid'
FROM users u
JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'marlon@nuclea.solutions'
  AND s.subscription_number = 'SL-2454598-92551-84'
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO invoices (user_id, subscription_id, invoice_number, invoice_date, due_date, description, payment_method, total_amount, balance_due, status)
SELECT
  u.id,
  s.id,
  'INV-DF-MEX-4720287-72127-14',
  '2025-09-27',
  '2025-09-26',
  'Subscription',
  'Card',
  4255.00,
  0.00,
  'paid'
FROM users u
JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'marlon@nuclea.solutions'
  AND s.subscription_number = 'SL-2454598-92551-84'
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO invoices (user_id, subscription_id, invoice_number, invoice_date, due_date, description, payment_method, total_amount, balance_due, status)
SELECT
  u.id,
  s.id,
  'INV-MEX-4441063-87355-32',
  '2025-08-27',
  '2025-08-26',
  'Subscription',
  'Card',
  4255.00,
  0.00,
  'paid'
FROM users u
JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'marlon@nuclea.solutions'
  AND s.subscription_number = 'SL-2454598-92551-84'
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO invoices (user_id, subscription_id, invoice_number, invoice_date, due_date, description, payment_method, total_amount, balance_due, status)
SELECT
  u.id,
  s.id,
  'INV-MEX-4200858-46709-35',
  '2025-07-27',
  '2025-07-26',
  'Subscription',
  'Card',
  6165.00,
  0.00,
  'paid'
FROM users u
JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'marlon@nuclea.solutions'
  AND s.subscription_number = 'SL-2454598-92551-84'
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO invoices (user_id, subscription_id, invoice_number, invoice_date, due_date, description, payment_method, total_amount, balance_due, status)
SELECT
  u.id,
  s.id,
  'INV-MEX-3966744-23069-41',
  '2025-06-27',
  '2025-06-26',
  'Subscription',
  'Card',
  6165.00,
  0.00,
  'paid'
FROM users u
JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'marlon@nuclea.solutions'
  AND s.subscription_number = 'SL-2454598-92551-84'
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO invoices (user_id, subscription_id, invoice_number, invoice_date, due_date, description, payment_method, total_amount, balance_due, status)
SELECT
  u.id,
  s.id,
  'INV-MEX-3741334-43962-31',
  '2025-05-27',
  '2025-05-26',
  'Subscription',
  'Card',
  6165.00,
  0.00,
  'paid'
FROM users u
JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'marlon@nuclea.solutions'
  AND s.subscription_number = 'SL-2454598-92551-84'
ON CONFLICT (invoice_number) DO NOTHING;

-- Insert test devices
INSERT INTO devices (user_id, subscription_id, device_type, device_name, starlink_id, serial_number, kit_number, software_version, status, uptime_seconds, last_updated)
SELECT
  u.id,
  s.id,
  'STARLINK',
  'STARLINK',
  '01000000-00000000-00ddcd30',
  '4PBA00939239',
  'KIT401010836',
  '2025.11.11.mr67551',
  'offline',
  383349,
  CURRENT_TIMESTAMP
FROM users u
JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'marlon@nuclea.solutions'
  AND s.subscription_number = 'SL-2454598-92551-84';

-- Insert billing info
INSERT INTO billing_info (user_id, cardholder_name, card_last_four, card_type, expiry_month, expiry_year, available_credits)
SELECT
  u.id,
  'Cristian Hernandez',
  '6985',
  'MasterCard',
  12,
  2029,
  0.00
FROM users u WHERE u.email = 'marlon@nuclea.solutions';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Users: 3, Subscriptions: 4, Orders: 2, Invoices: 6, Devices: 1';
END $$;
