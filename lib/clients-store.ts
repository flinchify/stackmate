export interface Client {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
  heroUrl: string;
  createdAt: string;
}

const clients: Client[] = [
  {
    id: 'c_umove',
    name: 'U-Move Australia',
    url: 'https://umove.lol',
    logoUrl: '/umove-logo.png',
    heroUrl: '/umove-hero.png',
    createdAt: '2026-03-30T00:00:00.000Z',
  },
];

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
