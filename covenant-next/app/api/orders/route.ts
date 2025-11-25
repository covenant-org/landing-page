import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { Order, CreateOrderInput } from '@/types';

// GET all orders
export async function GET() {
  try {
    const orders = await query<Order>(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.order_date DESC`
    );
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderInput = await request.json();
    const {
      user_id,
      order_number,
      order_date,
      status,
      item_name,
      item_description,
      tracking_number,
      tracking_url,
      estimated_delivery,
      total_amount,
    } = body;

    const order = await queryOne<Order>(
      `INSERT INTO orders
       (user_id, order_number, order_date, status, item_name, item_description,
        tracking_number, tracking_url, estimated_delivery, total_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        user_id,
        order_number,
        order_date,
        status || 'processing',
        item_name || null,
        item_description || null,
        tracking_number || null,
        tracking_url || null,
        estimated_delivery || null,
        total_amount || null,
      ]
    );

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
