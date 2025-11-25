import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { Invoice, CreateInvoiceInput } from '@/types';

// GET all invoices
export async function GET() {
  try {
    const invoices = await query<Invoice>(
      `SELECT i.*, u.name as user_name, u.email as user_email, s.subscription_number
       FROM invoices i
       LEFT JOIN users u ON i.user_id = u.id
       LEFT JOIN subscriptions s ON i.subscription_id = s.id
       ORDER BY i.invoice_date DESC`
    );
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new invoice
export async function POST(request: NextRequest) {
  try {
    const body: CreateInvoiceInput = await request.json();
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
      `INSERT INTO invoices
       (user_id, subscription_id, invoice_number, invoice_date, due_date,
        description, payment_method, total_amount, balance_due, status, pdf_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        user_id,
        subscription_id || null,
        invoice_number,
        invoice_date,
        due_date,
        description || null,
        payment_method || null,
        total_amount,
        balance_due || 0,
        status || 'unpaid',
        pdf_url || null,
      ]
    );

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
