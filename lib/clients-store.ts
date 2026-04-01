export interface Client {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
  heroUrl: string;
  createdAt: string;
}

const clients: Client[] = [];

export function addClient(data: Omit<Client, 'id' | 'createdAt'>): Client {
  const client: Client = {
    ...data,
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  clients.push(client);
  return client;
}

export function getClients(): Client[] {
  return [...clients];
}

export function removeClient(id: string): boolean {
  const idx = clients.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  clients.splice(idx, 1);
  return true;
}
