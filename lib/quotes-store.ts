import { type QuoteParams, estimatePrice } from './pricing';

export interface StoredQuote extends QuoteParams {
  id: string;
  estimate: ReturnType<typeof estimatePrice>;
  createdAt: string;
  status: string;
}

const quotes: StoredQuote[] = [];

export function addQuote(params: QuoteParams): StoredQuote {
  const estimate = estimatePrice(params);
  const id = `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const quote: StoredQuote = {
    ...params,
    id,
    estimate,
    createdAt: new Date().toISOString(),
    status: 'new',
  };
  quotes.push(quote);
  return quote;
}

export function getQuotes(): StoredQuote[] {
  return [...quotes].reverse();
}

export function updateQuoteStatus(id: string, status: string): StoredQuote | null {
  const quote = quotes.find((q) => q.id === id);
  if (!quote) return null;
  quote.status = status;
  return quote;
}
