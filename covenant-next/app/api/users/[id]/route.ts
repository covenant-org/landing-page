import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { User, UpdateUserInput } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single user by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await queryOne<User>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update user
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateUserInput = await request.json();
    const {
      email,
      name,
      phone,
      role,
      is_owner,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_zip,
      shipping_country,
    } = body;

    const user = await queryOne<User>(
      `UPDATE users
       SET email = COALESCE($1, email),
           name = COALESCE($2, name),
           phone = COALESCE($3, phone),
           role = COALESCE($4, role),
           is_owner = COALESCE($5, is_owner),
           shipping_address_line1 = COALESCE($6, shipping_address_line1),
           shipping_address_line2 = COALESCE($7, shipping_address_line2),
           shipping_city = COALESCE($8, shipping_city),
           shipping_state = COALESCE($9, shipping_state),
           shipping_zip = COALESCE($10, shipping_zip),
           shipping_country = COALESCE($11, shipping_country)
       WHERE id = $12
       RETURNING *`,
      [
        email,
        name,
        phone,
        role,
        is_owner,
        shipping_address_line1,
        shipping_address_line2,
        shipping_city,
        shipping_state,
        shipping_zip,
        shipping_country,
        id,
      ]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE user
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await queryOne<User>(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
