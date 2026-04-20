-- Add 10 more invoices to the database

INSERT INTO invoices (user_id, subscription_id, invoice_number, invoice_date, due_date, description, payment_method, total_amount, balance_due, status)
SELECT
  u.id,
  s.id,
  'INV-MEX-3500123-12345-21',
  '2025-04-27',
  '2025-04-26',
  'Subscription',
  'Card',
  5835.00,
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
  'INV-MEX-3200456-67890-22',
  '2025-03-27',
  '2025-03-26',
  'Subscription',
  'Card',
  5835.00,
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
  'INV-MEX-2900789-23456-23',
  '2025-02-27',
  '2025-02-26',
  'Subscription',
  'Card',
  4125.00,
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
  'INV-MEX-2600234-78901-24',
  '2025-01-27',
  '2025-01-26',
  'Subscription',
  'Card',
  4125.00,
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
  'INV-MEX-2300567-34567-25',
  '2024-12-27',
  '2024-12-26',
  'Subscription',
  'Card',
  4125.00,
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
  'INV-JAL-5500890-89012-26',
  '2024-11-27',
  '2024-11-26',
  'Subscription',
  'Card',
  3995.00,
  0.00,
  'paid'
FROM users u
JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'cristian@nuclea.solutions'
  AND s.subscription_number = 'SL-9876543-21098-76'
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO invoices (user_id, subscription_id, invoice_number, invoice_date, due_date, description, payment_method, total_amount, balance_due, status)
SELECT
  u.id,
  s.id,
  'INV-JAL-5200123-45678-27',
  '2024-10-27',
  '2024-10-26',
  'Subscription',
  'Card',
  3995.00,
  0.00,
  'paid'
FROM users u
JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'cristian@nuclea.solutions'
  AND s.subscription_number = 'SL-9876543-21098-76'
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO invoices (user_id, subscription_id, invoice_number, invoice_date, due_date, description, payment_method, total_amount, balance_due, status)
SELECT
  u.id,
  s.id,
  'INV-JAL-4900456-90123-28',
  '2024-09-27',
  '2024-09-26',
  'Subscription',
  'Card',
  3995.00,
  500.00,
  'unpaid'
FROM users u
JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'cristian@nuclea.solutions'
  AND s.subscription_number = 'SL-9876543-21098-76'
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO invoices (user_id, subscription_id, invoice_number, invoice_date, due_date, description, payment_method, total_amount, balance_due, status)
SELECT
  u.id,
  s.id,
  'INV-MINI-8800789-56789-29',
  '2025-11-15',
  '2025-11-14',
  'Subscription',
  'Card',
  2499.00,
  0.00,
  'paid'
FROM users u
JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'marlon@nuclea.solutions'
  AND s.subscription_number = 'SL-1234567-89012-34'
ON CONFLICT (invoice_number) DO NOTHING;

INSERT INTO invoices (user_id, subscription_id, invoice_number, invoice_date, due_date, description, payment_method, total_amount, balance_due, status)
SELECT
  u.id,
  s.id,
  'INV-MINI-8500234-67890-30',
  '2025-10-15',
  '2025-10-14',
  'Subscription',
  'Card',
  2499.00,
  2499.00,
  'unpaid'
FROM users u
JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'marlon@nuclea.solutions'
  AND s.subscription_number = 'SL-1234567-89012-34'
ON CONFLICT (invoice_number) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '10 additional invoices inserted successfully!';
END $$;
