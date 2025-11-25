import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { Order, UpdateOrderInput } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single order by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const order = await queryOne<Order>(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [id]
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update order
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateOrderInput = await request.json();
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
      `UPDATE orders
       SET user_id = COALESCE($1, user_id),
           order_number = COALESCE($2, order_number),
           order_date = COALESCE($3, order_date),
           status = COALESCE($4, status),
           item_name = COALESCE($5, item_name),
           item_description = COALESCE($6, item_description),
           tracking_number = COALESCE($7, tracking_number),
           tracking_url = COALESCE($8, tracking_url),
           estimated_delivery = COALESCE($9, estimated_delivery),
           total_amount = COALESCE($10, total_amount)
       WHERE id = $11
       RETURNING *`,
      [
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
        id,
      ]
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE order
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const order = await queryOne<Order>(
      'DELETE FROM orders WHERE id = $1 RETURNING *',
      [id]
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
