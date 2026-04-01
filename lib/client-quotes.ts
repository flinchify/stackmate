// Client-facing quotes that you create and send to clients
export interface ClientQuote {
  id: string;
  accessCode: string; // unique code client uses to view
  clientName: string;
  clientEmail: string;
  title: string;
  description: string;
  items: { description: string; amount: number }[];
  subtotal: number;
  gst: number;
  total: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  paymentType: 'one-time' | 'subscription';
  // For subscriptions:
  monthlyAmount?: number;
  setupFee?: number;
  // Payment terms
  paymentTerms: string;
  cancellationPolicy: string;
  createdAt: string;
  acceptedAt?: string;
  notes?: string;
}

const clientQuotes: ClientQuote[] = [];

export function createClientQuote(params: Omit<ClientQuote, 'id' | 'accessCode' | 'createdAt' | 'subtotal' | 'gst' | 'total'>): ClientQuote {
  const subtotal = params.items.reduce((s, i) => s + i.amount, 0);
  const gst = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + gst;
  const accessCode = Math.random().toString(36).slice(2, 10).toUpperCase();

  const quote: ClientQuote = {
    ...params,
    id: `cq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    accessCode,
    subtotal,
    gst,
    total,
    createdAt: new Date().toISOString(),
  };
  clientQuotes.push(quote);
  return quote;
}

export function getClientQuotes(): ClientQuote[] {
  return [...clientQuotes].reverse();
}

export function getClientQuoteByCode(code: string): ClientQuote | null {
  return clientQuotes.find(q => q.accessCode === code) || null;
}

export function updateClientQuote(id: string, updates: Partial<ClientQuote>): ClientQuote | null {
  const quote = clientQuotes.find(q => q.id === id);
  if (!quote) return null;
  Object.assign(quote, updates);
  return quote;
}

export function acceptClientQuote(code: string): ClientQuote | null {
  const quote = clientQuotes.find(q => q.accessCode === code);
  if (!quote) return null;
  quote.status = 'accepted';
  quote.acceptedAt = new Date().toISOString();
  return quote;
}

export function rejectClientQuote(code: string): ClientQuote | null {
  const quote = clientQuotes.find(q => q.accessCode === code);
  if (!quote) return null;
  quote.status = 'rejected';
  return quote;
}
