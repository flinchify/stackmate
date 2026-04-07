import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceById } from '@/lib/invoice';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  return NextResponse.json({ invoice });
}
