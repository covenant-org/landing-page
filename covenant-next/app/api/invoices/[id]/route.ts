import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { Invoice, UpdateInvoiceInput } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single invoice by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const invoice = await queryOne<Invoice>(
      `SELECT i.*, u.name as user_name, u.email as user_email, s.subscription_number
       FROM invoices i
       LEFT JOIN users u ON i.user_id = u.id
       LEFT JOIN subscriptions s ON i.subscription_id = s.id
       WHERE i.id = $1`,
      [id]
    );

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update invoice
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateInvoiceInput = await request.json();
    const {
      user_id,
      subscription_id,
      invoice_number,
      invoice_date,
      due_date,
      description,
      payment_method,
      total_amount,
      balance_due,
      status,
      pdf_url,
    } = body;

    const invoice = await queryOne<Invoice>(
      `UPDATE invoices
       SET user_id = COALESCE($1, user_id),
           subscription_id = COALESCE($2, subscription_id),
           invoice_number = COALESCE($3, invoice_number),
           invoice_date = COALESCE($4, invoice_date),
           due_date = COALESCE($5, due_date),
           description = COALESCE($6, description),
           payment_method = COALESCE($7, payment_method),
           total_amount = COALESCE($8, total_amount),
           balance_due = COALESCE($9, balance_due),
           status = COALESCE($10, status),
           pdf_url = COALESCE($11, pdf_url)
       WHERE id = $12
       RETURNING *`,
      [
        user_id,
        subscription_id,
        invoice_number,
        invoice_date,
        due_date,
        description,
        payment_method,
        total_amount,
        balance_due,
        status,
        pdf_url,
        id,
      ]
    );

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE invoice
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const invoice = await queryOne<Invoice>(
      'DELETE FROM invoices WHERE id = $1 RETURNING *',
      [id]
    );

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
