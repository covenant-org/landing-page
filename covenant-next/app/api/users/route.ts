import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { User, CreateUserInput } from '@/types';

// GET all users
export async function GET() {
  try {
    const users = await query<User>(
      'SELECT * FROM users ORDER BY created_at DESC'
    );
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(request: NextRequest) {
  try {
    const body: CreateUserInput = await request.json();
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
      `INSERT INTO users
       (email, name, phone, role, is_owner, shipping_address_line1, shipping_address_line2,
        shipping_city, shipping_state, shipping_zip, shipping_country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        email,
        name,
        phone || null,
        role || 'user',
        is_owner || false,
        shipping_address_line1 || null,
        shipping_address_line2 || null,
        shipping_city || null,
        shipping_state || null,
        shipping_zip || null,
        shipping_country || null,
      ]
    );

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
