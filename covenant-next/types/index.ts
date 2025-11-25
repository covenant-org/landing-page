// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: 'owner' | 'admin' | 'user' | 'viewer';
  is_owner: boolean;
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip: string | null;
  shipping_country: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  phone?: string;
  role?: 'owner' | 'admin' | 'user' | 'viewer';
  is_owner?: boolean;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
  shipping_country?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {}

// Subscription Types
export interface Subscription {
  id: string;
  user_id: string;
  subscription_number: string;
  nickname: string | null;
  service_location: string | null;
  service_plan: string | null;
  status: 'active' | 'inactive' | 'suspended' | 'cancelled';
  ip_policy: string;
  monthly_data_gb: number;
  data_used_gb: number;
  auto_top_up: boolean;
  billing_cycle_start: string | null;
  billing_cycle_end: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  user_name?: string;
  user_email?: string;
}

export interface CreateSubscriptionInput {
  user_id: string;
  subscription_number: string;
  nickname?: string;
  service_location?: string;
  service_plan?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'cancelled';
  ip_policy?: string;
  monthly_data_gb?: number;
  data_used_gb?: number;
  auto_top_up?: boolean;
  billing_cycle_start?: string;
  billing_cycle_end?: string;
}

export interface UpdateSubscriptionInput extends Partial<CreateSubscriptionInput> {}

// Order Types
export interface OrderItem {
  id: string;
  name: string;
  item_id: string | null;
  price: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  image_url: string | null;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  order_date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  item_name: string | null;
  item_description: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  estimated_delivery: string | null;
  total_amount: number | null;
  subtotal: number | null;
  tax: number | null;
  shipping_cost: number | null;
  shipping_address: string | null;
  items: OrderItem[] | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  user_name?: string;
  user_email?: string;
}

export interface CreateOrderInput {
  user_id: string;
  order_number: string;
  order_date: string;
  status?: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  item_name?: string;
  item_description?: string;
  tracking_number?: string;
  tracking_url?: string;
  estimated_delivery?: string;
  total_amount?: number;
}

export interface UpdateOrderInput extends Partial<CreateOrderInput> {}

// Invoice Types
export interface Invoice {
  id: string;
  user_id: string;
  subscription_id: string | null;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  description: string | null;
  payment_method: string | null;
  total_amount: number;
  balance_due: number;
  status: 'paid' | 'unpaid' | 'overdue' | 'cancelled';
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  user_name?: string;
  user_email?: string;
  subscription_number?: string;
}

export interface CreateInvoiceInput {
  user_id: string;
  subscription_id?: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  description?: string;
  payment_method?: string;
  total_amount: number;
  balance_due?: number;
  status?: 'paid' | 'unpaid' | 'overdue' | 'cancelled';
  pdf_url?: string;
}

export interface UpdateInvoiceInput extends Partial<CreateInvoiceInput> {}

// Device Types
export interface Device {
  id: string;
  user_id: string;
  subscription_id: string | null;
  device_type: string;
  device_name: string | null;
  starlink_id: string | null;
  serial_number: string | null;
  kit_number: string | null;
  software_version: string | null;
  status: 'online' | 'offline' | 'stowed' | 'updating';
  uptime_seconds: number;
  last_updated: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  user_name?: string;
  user_email?: string;
  subscription_number?: string;
}

export interface CreateDeviceInput {
  user_id: string;
  subscription_id?: string;
  device_type: string;
  device_name?: string;
  starlink_id?: string;
  serial_number?: string;
  kit_number?: string;
  software_version?: string;
  status?: 'online' | 'offline' | 'stowed' | 'updating';
  uptime_seconds?: number;
}

export interface UpdateDeviceInput extends Partial<CreateDeviceInput> {}

// Device Metric Types
export interface DeviceMetric {
  id: string;
  device_id: string;
  metric_type: 'download_speed' | 'upload_speed' | 'latency' | 'uptime_percent' | 'signal_quality';
  value: number;
  unit: string;
  recorded_at: string;
}

export interface CreateDeviceMetricInput {
  device_id: string;
  metric_type: 'download_speed' | 'upload_speed' | 'latency' | 'uptime_percent' | 'signal_quality';
  value: number;
  unit: string;
}

// Billing Info Types
export interface BillingInfo {
  id: string;
  user_id: string;
  cardholder_name: string | null;
  card_last_four: string | null;
  card_type: 'visa' | 'mastercard' | 'amex' | 'discover' | null;
  expiry_month: number | null;
  expiry_year: number | null;
  billing_cycle_day: number;
  available_credits: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBillingInfoInput {
  user_id: string;
  cardholder_name?: string;
  card_last_four?: string;
  card_type?: 'visa' | 'mastercard' | 'amex' | 'discover';
  expiry_month?: number;
  expiry_year?: number;
  billing_cycle_day?: number;
  available_credits?: number;
  is_primary?: boolean;
}

export interface UpdateBillingInfoInput extends Partial<CreateBillingInfoInput> {}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Timeframe type for device metrics
export type MetricTimeframe = '15min' | '3hours' | '1day' | '7days' | '30days';
