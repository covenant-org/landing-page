import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { Device, UpdateDeviceInput } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single device by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const device = await queryOne<Device>(
      `SELECT d.*, u.name as user_name, u.email as user_email, s.subscription_number
       FROM devices d
       LEFT JOIN users u ON d.user_id = u.id
       LEFT JOIN subscriptions s ON d.subscription_id = s.id
       WHERE d.id = $1`,
      [id]
    );

    if (!device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(device);
  } catch (error) {
    console.error('Error fetching device:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update device
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateDeviceInput = await request.json();
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
      `UPDATE devices
       SET user_id = COALESCE($1, user_id),
           subscription_id = COALESCE($2, subscription_id),
           device_type = COALESCE($3, device_type),
           device_name = COALESCE($4, device_name),
           starlink_id = COALESCE($5, starlink_id),
           serial_number = COALESCE($6, serial_number),
           kit_number = COALESCE($7, kit_number),
           software_version = COALESCE($8, software_version),
           status = COALESCE($9, status),
           uptime_seconds = COALESCE($10, uptime_seconds),
           last_updated = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [
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
        id,
      ]
    );

    if (!device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(device);
  } catch (error) {
    console.error('Error updating device:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE device
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const device = await queryOne<Device>(
      'DELETE FROM devices WHERE id = $1 RETURNING *',
      [id]
    );

    if (!device) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Error deleting device:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
