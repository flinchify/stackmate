import { getInvoiceById } from '@/lib/invoice';
import { notFound } from 'next/navigation';
import PrintButton from './PrintButton';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
  };

  return (
    <>
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .invoice-page { padding: 0 !important; max-width: 100% !important; box-shadow: none !important; }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 py-8 px-4 print:bg-white print:py-0 print:px-0">
        {/* Print / Download bar */}
        <div className="no-print max-w-3xl mx-auto mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">To download as PDF, use Print → Save as PDF (Ctrl+P / Cmd+P)</p>
          <PrintButton />
        </div>

        <div className="invoice-page max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-10 print:shadow-none print:rounded-none">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">stackmate</h1>
              <p className="text-sm text-gray-500 mt-1">Perth WA, Australia</p>
              <p className="text-sm text-gray-500">ABN: XX XXX XXX XXX</p>
              <p className="text-sm text-gray-500">hello@stackmate.digital</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">Invoice</h2>
              <p className="text-lg font-bold text-gray-900 mt-1">{invoice.id}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColors[invoice.status] || 'bg-gray-100 text-gray-700'}`}>
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Client + Dates */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Bill To</p>
              <p className="font-semibold text-gray-900">{invoice.clientName}</p>
              <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
              {invoice.clientAddress && <p className="text-sm text-gray-600 mt-1">{invoice.clientAddress}</p>}
            </div>
            <div className="text-right">
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Issue Date</p>
                <p className="text-sm text-gray-900">{new Date(invoice.issuedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Due Date</p>
                <p className="text-sm text-gray-900">{new Date(invoice.dueAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide py-3">Description</th>
                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide py-3 w-20">Qty</th>
                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide py-3 w-32">Unit Price</th>
                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide py-3 w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item: { description: string; quantity: number; unitPrice: number; total: number }, i: number) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-900">{item.description}</td>
                  <td className="py-3 text-sm text-gray-700 text-center">{item.quantity}</td>
                  <td className="py-3 text-sm text-gray-700 text-right">${item.unitPrice.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 text-sm text-gray-900 font-medium text-right">${item.total.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-10">
            <div className="w-64">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">${invoice.subtotal.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-2 text-sm border-b border-gray-200">
                <span className="text-gray-500">GST (10%)</span>
                <span className="text-gray-900">${invoice.gst.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-bold">
                <span className="text-gray-900">Total AUD</span>
                <span className="text-gray-900">${invoice.total.toLocaleString('en-AU', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Payment Terms</p>
            <p className="text-sm text-gray-700">Bank Transfer — details provided separately</p>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Notes</p>
              <p className="text-sm text-gray-700">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-400">Thank you for your business</p>
            <p className="text-xs text-gray-300 mt-2">stackmate.digital</p>
          </div>
        </div>
      </div>
    </>
  );
}
