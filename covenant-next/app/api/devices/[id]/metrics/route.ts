import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { DeviceMetric, CreateDeviceMetricInput, MetricTimeframe } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET device metrics
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get('timeframe') || '15min') as MetricTimeframe;

    // Calculate the time range based on timeframe
    let interval: string;
    switch (timeframe) {
      case '15min':
        interval = '15 minutes';
        break;
      case '3hours':
        interval = '3 hours';
        break;
      case '1day':
        interval = '1 day';
        break;
      case '7days':
        interval = '7 days';
        break;
      case '30days':
        interval = '30 days';
        break;
      default:
        interval = '15 minutes';
    }

    const metrics = await query<DeviceMetric>(
      `SELECT * FROM device_metrics
       WHERE device_id = $1
       AND recorded_at >= NOW() - INTERVAL '${interval}'
       ORDER BY recorded_at DESC`,
      [id]
    );

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching device metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create device metric
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: Omit<CreateDeviceMetricInput, 'device_id'> = await request.json();
    const { metric_type, value, unit } = body;

    const metric = await queryOne<DeviceMetric>(
      `INSERT INTO device_metrics (device_id, metric_type, value, unit)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, metric_type, value, unit]
    );

    return NextResponse.json(metric, { status: 201 });
  } catch (error) {
    console.error('Error creating device metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
