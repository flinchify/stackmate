'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import QuoteModal from '@/components/QuoteModal';

interface Client {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
  heroUrl: string;
}

function ClientCard({ client, index }: { client: Client; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.a
      ref={ref}
      href={client.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group block rounded-xl border border-sm-border bg-sm-card/30 overflow-hidden hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Hero screenshot */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={client.heroUrl}
          alt={`${client.name} website`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sm-dark/80 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={client.logoUrl}
            alt={`${client.name} logo`}
            width={32}
            height={32}
            className="rounded-md"
          />
          <div>
            <h3 className="font-display font-semibold">{client.name}</h3>
            <p className="text-xs text-sm-muted">{client.url.replace(/^https?:\/\//, '')}</p>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-sm-muted group-hover:text-white transition-colors" />
      </div>
    </motion.a>
  );
}

export default function ClientsPage() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/clients')
      .then((res) => res.json())
      .then((data) => { setClients(data.clients || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main>
      <Header onQuoteClick={() => setQuoteOpen(true)} />
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />

      <section className="pt-32 pb-16 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm text-sm-muted uppercase tracking-widest mb-4">Our Clients</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
            Built by us. Powered by them.
          </h1>
          <p className="text-lg text-sm-light max-w-2xl">
            Real businesses. Real results. Every project delivered in 1-2 days.
          </p>
        </motion.div>
      </section>

      <section className="pb-24 max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="text-center py-20 text-sm-muted">Loading...</div>
        ) : clients.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm-muted mb-2">Our client showcase is coming soon.</p>
            <p className="text-sm text-sm-muted">Be the first — get a quote and join the list.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client, i) => (
              <ClientCard key={client.id} client={client} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="py-20 bg-white text-black">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Want your business here?</h2>
          <p className="text-black/60 mb-8">Get a quote and we&apos;ll build something worth showing off.</p>
          <button onClick={() => setQuoteOpen(true)}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-display font-bold rounded-xl transition-all hover:bg-black/80 hover:scale-[1.03] active:scale-[0.98]"
          >
            Get a Quote <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </main>
  );
}
