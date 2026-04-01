import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog | AI Automation & Business Systems Insights',
  description: 'Insights on AI automation, business systems, and technology for Perth businesses. Expert guides from Stackmate.',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <Link href="/" className="text-sm text-sm-muted hover:text-white transition-colors">&larr; Back to Stackmate</Link>
          <h1 className="text-4xl md:text-5xl font-display font-bold mt-6 mb-4">Blog</h1>
          <p className="text-lg text-sm-light">Insights on AI, automation, and building better business systems.</p>
        </div>

        <div className="space-y-6">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="p-6 rounded-xl border border-sm-border bg-sm-card/30 hover:bg-sm-card/60 hover:border-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs px-2 py-1 rounded-md bg-sm-border text-sm-light">{post.category}</span>
                  <span className="text-xs text-sm-muted">{post.date}</span>
                  <span className="text-xs text-sm-muted">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-display font-bold group-hover:text-white/90 transition-colors mb-2">{post.title}</h2>
                <p className="text-sm text-sm-muted leading-relaxed">{post.description}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
