import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { Subscription, CreateSubscriptionInput } from '@/types';

// GET all subscriptions
export async function GET() {
  try {
    const subscriptions = await query<Subscription>(
      `SELECT s.*, u.name as user_name, u.email as user_email
       FROM subscriptions s
       LEFT JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC`
    );
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new subscription
export async function POST(request: NextRequest) {
  try {
    const body: CreateSubscriptionInput = await request.json();
    const {
      user_id,
      subscription_number,
      nickname,
      service_location,
      service_plan,
      status,
      ip_policy,
      monthly_data_gb,
      data_used_gb,
      auto_top_up,
      billing_cycle_start,
      billing_cycle_end,
    } = body;

    const subscription = await queryOne<Subscription>(
      `INSERT INTO subscriptions
       (user_id, subscription_number, nickname, service_location, service_plan,
        status, ip_policy, monthly_data_gb, data_used_gb, auto_top_up,
        billing_cycle_start, billing_cycle_end)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        user_id,
        subscription_number,
        nickname || null,
        service_location || null,
        service_plan || null,
        status || 'active',
        ip_policy || 'default',
        monthly_data_gb || 350,
        data_used_gb || 0,
        auto_top_up || false,
        billing_cycle_start || null,
        billing_cycle_end || null,
      ]
    );

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
