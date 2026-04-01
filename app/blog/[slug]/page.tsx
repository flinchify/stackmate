import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPost, BLOG_POSTS } from '@/lib/blog';
import QuoteButton from '@/components/QuoteButton';

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-display font-bold mt-10 mb-4">{line.slice(3)}</h2>);
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={i} className="font-semibold text-white mt-4 mb-1">{line.slice(2, -2)}</p>);
    } else if (line.startsWith('- ')) {
      elements.push(<li key={i} className="text-sm-light ml-4 list-disc">{line.slice(2)}</li>);
    } else if (line.trim() === '') {
      continue;
    } else {
      // Handle inline bold and links
      const parsed = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-white underline hover:text-white/80">$1</a>');
      elements.push(<p key={i} className="text-sm-light leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: parsed }} />);
    }
  }

  return elements;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Stackmate' },
    publisher: { '@type': 'Organization', name: 'Stackmate', url: 'https://stackmate.com.au' },
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="text-sm text-sm-muted hover:text-white transition-colors">&larr; All posts</Link>

        <div className="mt-6 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs px-2 py-1 rounded-md bg-sm-border text-sm-light">{post.category}</span>
            <span className="text-xs text-sm-muted">{post.date}</span>
            <span className="text-xs text-sm-muted">{post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-4">{post.title}</h1>
          <p className="text-lg text-sm-light">{post.description}</p>
        </div>

        <div className="border-t border-sm-border pt-8">
          {renderContent(post.content)}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 rounded-xl border border-sm-border bg-sm-card/30 text-center">
          <h3 className="text-xl font-display font-bold mb-2">Ready to automate your business?</h3>
          <p className="text-sm-muted mb-4">Get a custom quote in 60 seconds. No sales calls unless you want one.</p>
          <QuoteButton className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors">
            Get a Quote
          </QuoteButton>
        </div>
      </article>
    </main>
  );
}
