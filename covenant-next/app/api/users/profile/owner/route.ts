import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { User } from '@/types';

// GET owner user
export async function GET() {
  try {
    const user = await queryOne<User>(
      'SELECT * FROM users WHERE is_owner = true LIMIT 1'
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Owner user not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching owner user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
