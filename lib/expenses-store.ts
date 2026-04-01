import { sql, ensureTables } from './db';

export interface Expense {
  id: string; clientName?: string; category: string; description: string;
  amount: number; recurring: boolean; frequency?: string; date: string; createdAt: string;
}

export async function addExpense(params: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
  await ensureTables();
  const id = `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  await sql`INSERT INTO expenses (id, client_name, category, description, amount, recurring, frequency, date)
    VALUES (${id}, ${params.clientName || null}, ${params.category}, ${params.description}, ${params.amount}, ${params.recurring}, ${params.frequency || null}, ${params.date || null})`;
  return { ...params, id, createdAt: new Date().toISOString() };
}

export async function getExpenses(): Promise<Expense[]> {
  await ensureTables();
  const rows = await sql`SELECT * FROM expenses ORDER BY created_at DESC`;
  return rows.map(r => ({ id: r.id, clientName: r.client_name, category: r.category, description: r.description, amount: Number(r.amount), recurring: r.recurring, frequency: r.frequency, date: r.date, createdAt: r.created_at }));
}

export async function deleteExpense(id: string): Promise<boolean> {
  await ensureTables();
  const rows = await sql`DELETE FROM expenses WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}
