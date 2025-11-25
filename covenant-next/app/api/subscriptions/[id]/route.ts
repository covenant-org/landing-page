import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { Subscription, UpdateSubscriptionInput } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single subscription by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const subscription = await queryOne<Subscription>(
      `SELECT s.*, u.name as user_name, u.email as user_email
       FROM subscriptions s
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [id]
    );

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update subscription
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateSubscriptionInput = await request.json();
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
      `UPDATE subscriptions
       SET user_id = COALESCE($1, user_id),
           subscription_number = COALESCE($2, subscription_number),
           nickname = COALESCE($3, nickname),
           service_location = COALESCE($4, service_location),
           service_plan = COALESCE($5, service_plan),
           status = COALESCE($6, status),
           ip_policy = COALESCE($7, ip_policy),
           monthly_data_gb = COALESCE($8, monthly_data_gb),
           data_used_gb = COALESCE($9, data_used_gb),
           auto_top_up = COALESCE($10, auto_top_up),
           billing_cycle_start = COALESCE($11, billing_cycle_start),
           billing_cycle_end = COALESCE($12, billing_cycle_end)
       WHERE id = $13
       RETURNING *`,
      [
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
        id,
      ]
    );

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE subscription
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const subscription = await queryOne<Subscription>(
      'DELETE FROM subscriptions WHERE id = $1 RETURNING *',
      [id]
    );

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
