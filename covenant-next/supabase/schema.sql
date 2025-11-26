-- Covenant Station Database Schema for Supabase
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- USERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'user', 'viewer', 'technical', 'technical_configuration', 'technical_viewer')),
  is_owner BOOLEAN DEFAULT FALSE,
  shipping_address_line1 VARCHAR(255),
  shipping_address_line2 VARCHAR(255),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_zip VARCHAR(20),
  shipping_country VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================
-- SUBSCRIPTIONS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_number VARCHAR(100) UNIQUE NOT NULL,
  nickname VARCHAR(255),
  service_location VARCHAR(255),
  service_plan VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'cancelled')),
  ip_policy VARCHAR(50) DEFAULT 'dynamic',
  monthly_data_gb INTEGER DEFAULT 0,
  data_used_gb NUMERIC(10, 2) DEFAULT 0,
  auto_top_up BOOLEAN DEFAULT FALSE,
  billing_cycle_start DATE,
  billing_cycle_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================
-- ORDERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  order_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'processing' CHECK (status IN ('processing', 'shipped', 'delivered', 'cancelled')),
  item_name VARCHAR(255),
  item_description TEXT,
  tracking_number VARCHAR(100),
  tracking_url VARCHAR(500),
  estimated_delivery DATE,
  total_amount NUMERIC(12, 2),
  subtotal NUMERIC(12, 2),
  tax NUMERIC(12, 2),
  shipping_cost NUMERIC(12, 2),
  shipping_address TEXT,
  items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================
-- INVOICES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  description TEXT,
  payment_method VARCHAR(50),
  total_amount NUMERIC(12, 2) NOT NULL,
  balance_due NUMERIC(12, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid', 'overdue', 'cancelled')),
  pdf_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================
-- DEVICES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  device_type VARCHAR(100) NOT NULL,
  device_name VARCHAR(255),
  starlink_id VARCHAR(100),
  serial_number VARCHAR(100),
  kit_number VARCHAR(100),
  software_version VARCHAR(50),
  status VARCHAR(50) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'stowed', 'updating')),
  uptime_seconds BIGINT DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================
-- DEVICE METRICS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS device_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('download_speed', 'upload_speed', 'latency', 'uptime_percent', 'signal_quality')),
  value NUMERIC(12, 4) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================
-- BILLING INFO TABLE
-- =====================
CREATE TABLE IF NOT EXISTS billing_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cardholder_name VARCHAR(255),
  card_last_four VARCHAR(4),
  card_type VARCHAR(50) CHECK (card_type IN ('visa', 'mastercard', 'amex', 'discover')),
  expiry_month INTEGER CHECK (expiry_month >= 1 AND expiry_month <= 12),
  expiry_year INTEGER,
  billing_cycle_day INTEGER DEFAULT 27 CHECK (billing_cycle_day >= 1 AND billing_cycle_day <= 28),
  available_credits NUMERIC(12, 2) DEFAULT 0,
  is_primary BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_subscription_id ON devices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_device_metrics_device_id ON device_metrics(device_id);
CREATE INDEX IF NOT EXISTS idx_device_metrics_recorded_at ON device_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_billing_info_user_id ON billing_info(user_id);

-- =====================
-- ROW LEVEL SECURITY (RLS)
-- =====================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_info ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (adjust based on your auth needs)
-- For now, allow service role full access
CREATE POLICY "Service role has full access to users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to subscriptions"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to orders"
  ON orders FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to invoices"
  ON invoices FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to devices"
  ON devices FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to device_metrics"
  ON device_metrics FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to billing_info"
  ON billing_info FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================
-- UPDATED_AT TRIGGER
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_info_updated_at
  BEFORE UPDATE ON billing_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- SAMPLE DATA (Optional - remove if not needed)
-- =====================
-- Insert a sample owner user
INSERT INTO users (email, name, phone, role, is_owner, shipping_address_line1, shipping_city, shipping_state, shipping_zip, shipping_country)
VALUES ('owner@covenant.com', 'Cristian Hernandez', '+52 555 123 4567', 'owner', true, 'Mar mediterraneo 1118', 'Tijuana', 'Baja California', '22550', 'Mexico')
ON CONFLICT (email) DO NOTHING;

-- Insert sample subscription
INSERT INTO subscriptions (user_id, subscription_number, nickname, service_location, service_plan, status, ip_policy, monthly_data_gb, data_used_gb)
SELECT id, 'SUB-2024-001', 'Home Office', 'Tijuana, BC', 'Residential', 'active', 'dynamic', 1000, 245.5
FROM users WHERE email = 'owner@covenant.com'
ON CONFLICT (subscription_number) DO NOTHING;

-- Insert sample order
INSERT INTO orders (user_id, order_number, order_date, status, item_name, item_description, tracking_number, tracking_url, estimated_delivery, total_amount, subtotal, tax, shipping_cost, shipping_address)
SELECT id, 'ORD-5549304-70292-45', '2022-07-12', 'shipped', 'Starlink Standard Actuated Kit', 'Complete Starlink kit with dish and router', 'ORD-5549304-70292-45', 'https://tracking.example.com/ORD-5549304-70292-45', '2022-07-20', 12477.42, 9054.66, 2002.76, 1420.00, 'Mar mediterraneo 1118, Country club'
FROM users WHERE email = 'owner@covenant.com'
ON CONFLICT (order_number) DO NOTHING;

-- Insert sample invoice
INSERT INTO invoices (user_id, invoice_number, invoice_date, due_date, description, payment_method, total_amount, balance_due, status)
SELECT id, 'INV-DF-MEX-4995798-68810', '2025-10-27', '2025-10-26', 'Subscription', 'credit_card', 4835.00, 0.00, 'paid'
FROM users WHERE email = 'owner@covenant.com'
ON CONFLICT (invoice_number) DO NOTHING;

-- Insert sample device
INSERT INTO devices (user_id, device_type, device_name, starlink_id, serial_number, kit_number, software_version, status, uptime_seconds)
SELECT id, 'Starlink Dish', 'Main Dish', 'STL-2024-001', 'SN-ABC123456', 'KIT-2024-001', '2024.12.0', 'online', 864000
FROM users WHERE email = 'owner@covenant.com'
ON CONFLICT DO NOTHING;

-- Insert sample billing info
INSERT INTO billing_info (user_id, cardholder_name, card_last_four, card_type, expiry_month, expiry_year, billing_cycle_day, available_credits)
SELECT id, 'Cristian Hernandez', '6985', 'mastercard', 12, 2029, 27, 0.00
FROM users WHERE email = 'owner@covenant.com'
ON CONFLICT DO NOTHING;
