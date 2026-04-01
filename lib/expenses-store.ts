export interface Expense {
  id: string;
  clientName?: string; // optional — can be general expense
  category: 'api' | 'hosting' | 'tools' | 'twilio' | 'ads' | 'contractor' | 'software' | 'other';
  description: string;
  amount: number;
  recurring: boolean;
  frequency?: 'monthly' | 'yearly' | 'one-time';
  date: string;
  createdAt: string;
}

const expenses: Expense[] = [];

export function addExpense(params: Omit<Expense, 'id' | 'createdAt'>): Expense {
  const expense: Expense = {
    ...params,
    id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  expenses.push(expense);
  return expense;
}

export function getExpenses(): Expense[] {
  return [...expenses].reverse();
}

export function deleteExpense(id: string): boolean {
  const idx = expenses.findIndex(e => e.id === id);
  if (idx === -1) return false;
  expenses.splice(idx, 1);
  return true;
}

export function getMonthlyExpenses(): number {
  return expenses.filter(e => e.recurring && e.frequency === 'monthly').reduce((s, e) => s + e.amount, 0);
}

export function getExpensesByClient(): Record<string, number> {
  const map: Record<string, number> = {};
  expenses.forEach(e => {
    const key = e.clientName || 'General';
    const monthly = e.recurring && e.frequency === 'monthly' ? e.amount : e.recurring && e.frequency === 'yearly' ? e.amount / 12 : 0;
    map[key] = (map[key] || 0) + monthly;
  });
  return map;
}
