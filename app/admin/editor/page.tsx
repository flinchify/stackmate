'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, Save, FileText, Briefcase } from 'lucide-react';

interface Post {
  id: string; type: string; title: string; slug: string; description: string;
  content: string; imageUrl?: string; category?: string; tags: string[];
  links: { label: string; url: string }[]; status: string; createdAt: string;
}

const inputClass = 'w-full px-4 py-3 bg-sm-dark border border-sm-border rounded-lg text-white placeholder-sm-muted focus:outline-none focus:border-orange-500/30 transition-colors text-sm';

export default function EditorPage() {
  const [secret] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('sm_admin_secret') || '' : '');
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'blog' | 'case-study'>('blog');
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState({ type: 'blog' as string, title: '', slug: '', description: '', content: '', imageUrl: '', category: '', tags: '', status: 'draft' as string, links: [{ label: '', url: '' }] });

  const headers = () => ({ 'x-admin-secret': secret, 'Content-Type': 'application/json' });

  const fetchPosts = async () => {
    const res = await fetch(`/api/admin/posts?type=${activeTab}`, { headers: { 'x-admin-secret': secret } });
    if (res.ok) { const data = await res.json(); setPosts(data.posts || []); }
  };

  useEffect(() => { fetchPosts(); }, [activeTab]);

  const resetForm = () => setForm({ type: activeTab, title: '', slug: '', description: '', content: '', imageUrl: '', category: '', tags: '', status: 'draft', links: [{ label: '', url: '' }] });

  const loadPost = (post: Post) => {
    setEditing(post);
    setForm({ type: post.type, title: post.title, slug: post.slug, description: post.description, content: post.content, imageUrl: post.imageUrl || '', category: post.category || '', tags: (post.tags || []).join(', '), status: post.status, links: post.links?.length ? post.links : [{ label: '', url: '' }] });
  };

  const savePost = async () => {
    if (!form.title || !form.content) return alert('Title and content required');
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const links = form.links.filter(l => l.label && l.url);

    if (editing) {
      await fetch('/api/admin/posts', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: editing.id, title: form.title, description: form.description, content: form.content, imageUrl: form.imageUrl, category: form.category, tags, links, status: form.status }) });
    } else {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await fetch('/api/admin/posts', { method: 'POST', headers: headers(), body: JSON.stringify({ ...form, slug, tags, links }) });
    }
    setEditing(null);
    resetForm();
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await fetch('/api/admin/posts', { method: 'DELETE', headers: headers(), body: JSON.stringify({ id }) });
    fetchPosts();
  };

  const togglePublish = async (post: Post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await fetch('/api/admin/posts', { method: 'PATCH', headers: headers(), body: JSON.stringify({ id: post.id, status: newStatus }) });
    fetchPosts();
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <a href="/admin" className="text-sm text-sm-muted hover:text-white">&larr; Admin</a>
            <h1 className="text-2xl font-display font-bold mt-2">Content Editor</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setActiveTab('blog'); resetForm(); setEditing(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm ${activeTab === 'blog' ? 'bg-orange-500 text-white' : 'border border-sm-border text-sm-light'}`}
            ><FileText className="w-4 h-4" /> Blog Posts</button>
            <button onClick={() => { setActiveTab('case-study'); resetForm(); setEditing(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm ${activeTab === 'case-study' ? 'bg-orange-500 text-white' : 'border border-sm-border text-sm-light'}`}
            ><Briefcase className="w-4 h-4" /> Case Studies</button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Post list */}
          <div className="w-72 shrink-0 space-y-2">
            <button onClick={() => { resetForm(); setEditing(null); }} className="w-full flex items-center gap-2 px-4 py-3 rounded-sm border border-dashed border-orange-500/30 text-orange-400 text-sm hover:bg-orange-500/5">
              <Plus className="w-4 h-4" /> New {activeTab === 'blog' ? 'Blog Post' : 'Case Study'}
            </button>
            {posts.map(post => (
              <button key={post.id} onClick={() => loadPost(post)}
                className={`w-full text-left px-4 py-3 rounded-sm border text-sm ${editing?.id === post.id ? 'border-orange-500/30 bg-orange-500/5' : 'border-sm-border bg-sm-card/30 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-semibold truncate flex-1">{post.title}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-sm ml-2 ${post.status === 'published' ? 'bg-green-400/10 text-green-400' : 'bg-sm-border text-sm-muted'}`}>{post.status}</span>
                </div>
                <p className="text-xs text-sm-muted mt-1 truncate">{post.description || 'No description'}</p>
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="flex-1 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-sm-muted mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Post title" />
              </div>
              <div>
                <label className="block text-xs text-sm-muted mb-1">Slug (auto-generated if empty)</label>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className={inputClass} placeholder="post-url-slug" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-sm-muted mb-1">Description / Summary</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={inputClass} placeholder="Brief description for SEO and previews" />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-sm-muted mb-1">Featured Image URL</label>
                <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className={inputClass} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs text-sm-muted mb-1">Category</label>
                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass} placeholder="e.g. AI, SEO, Mining" />
              </div>
              <div>
                <label className="block text-xs text-sm-muted mb-1">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className={inputClass} placeholder="perth, ai, automation" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-sm-muted mb-1">Content * (Markdown supported)</label>
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                className={`${inputClass} h-64 resize-y font-mono`} placeholder="Write your content here. Use markdown: ## Heading, **bold**, - bullets, [link](url)" />
            </div>

            {/* Links */}
            <div>
              <label className="block text-xs text-sm-muted mb-1">Links</label>
              {form.links.map((link, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={link.label} onChange={e => { const l = [...form.links]; l[i].label = e.target.value; setForm({ ...form, links: l }); }} className={`${inputClass} w-40`} placeholder="Label" />
                  <input value={link.url} onChange={e => { const l = [...form.links]; l[i].url = e.target.value; setForm({ ...form, links: l }); }} className={inputClass} placeholder="https://..." />
                  {form.links.length > 1 && <button onClick={() => { const l = form.links.filter((_, j) => j !== i); setForm({ ...form, links: l }); }} className="text-red-400"><Trash2 className="w-4 h-4" /></button>}
                </div>
              ))}
              <button onClick={() => setForm({ ...form, links: [...form.links, { label: '', url: '' }] })} className="text-xs text-orange-400 hover:underline">+ Add link</button>
            </div>

            {form.imageUrl && (
              <div className="rounded-sm border border-sm-border overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.imageUrl} alt="Preview" className="w-full max-h-48 object-cover" />
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-sm-border">
              <div className="flex gap-2">
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={`${inputClass} w-32`}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex gap-2">
                {editing && (
                  <>
                    <button onClick={() => togglePublish(editing)} className="px-4 py-2 rounded-sm border border-sm-border text-sm text-sm-light hover:border-white/30">
                      <Eye className="w-4 h-4 inline mr-1" /> {editing.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => deletePost(editing.id)} className="px-4 py-2 rounded-sm border border-red-500/30 text-sm text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                    </button>
                  </>
                )}
                <button onClick={savePost} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-sm flex items-center gap-2">
                  <Save className="w-4 h-4" /> {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
