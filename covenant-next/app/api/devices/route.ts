import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { Device, CreateDeviceInput } from '@/types';

// GET all devices
export async function GET() {
  try {
    const devices = await query<Device>(
      `SELECT d.*, u.name as user_name, u.email as user_email, s.subscription_number
       FROM devices d
       LEFT JOIN users u ON d.user_id = u.id
       LEFT JOIN subscriptions s ON d.subscription_id = s.id
       ORDER BY d.created_at DESC`
    );
    return NextResponse.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new device
export async function POST(request: NextRequest) {
  try {
    const body: CreateDeviceInput = await request.json();
    const {
      user_id,
      subscription_id,
      device_type,
      device_name,
      starlink_id,
      serial_number,
      kit_number,
      software_version,
      status,
      uptime_seconds,
    } = body;

    const device = await queryOne<Device>(
      `INSERT INTO devices
       (user_id, subscription_id, device_type, device_name, starlink_id,
        serial_number, kit_number, software_version, status, uptime_seconds)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        user_id,
        subscription_id || null,
        device_type,
        device_name || null,
        starlink_id || null,
        serial_number || null,
        kit_number || null,
        software_version || null,
        status || 'offline',
        uptime_seconds || 0,
      ]
    );

    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    console.error('Error creating device:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
