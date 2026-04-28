import { useState, useEffect } from 'react';
import { postsAPI } from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const BLANK = { title: '', titleTamil: '', content: '', contentTamil: '', category: 'article', tags: '', published: false };

export default function AdminPosts() {
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState(BLANK);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const load = () => postsAPI.getAll({ limit: 50 }).then(r => setPosts(r.data.data)).catch(console.error);
    useEffect(() => { load(); }, []);

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
            if (editing) {
                await postsAPI.update(editing, payload);
                toast.success('Post updated!');
            } else {
                await postsAPI.create(payload);
                toast.success('Post created!');
            }
            setForm(BLANK); setEditing(null); setShowForm(false); load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving post');
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this post?')) return;
        await postsAPI.delete(id);
        toast.success('Deleted'); load();
    };

    const startEdit = (post) => {
        setForm({ ...post, tags: post.tags?.join(', ') || '', titleTamil: post.titleTamil || '', contentTamil: post.contentTamil || '' });
        setEditing(post._id); setShowForm(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="font-display text-xl font-semibold">Posts ({posts.length})</h2>
                <button onClick={() => { setForm(BLANK); setEditing(null); setShowForm(!showForm); }}
                    className="btn-primary">{showForm ? 'Cancel' : '+ New Post'}</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title (English)</label>
                            <input name="title" required value={form.title} onChange={handleChange} className="input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">தலைப்பு (Tamil)</label>
                            <input name="titleTamil" value={form.titleTamil} onChange={handleChange} className="input font-tamil" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Content (Tamil)</label>
                        <textarea name="contentTamil" rows={6} value={form.contentTamil} onChange={handleChange}
                            className="input resize-none font-tamil" placeholder="தமிழில் உள்ளடக்கம்..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Content (English)</label>
                        <textarea name="content" required rows={4} value={form.content} onChange={handleChange}
                            className="input resize-none" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select name="category" value={form.category} onChange={handleChange} className="input">
                                {['article', 'sermon', 'testimony', 'announcement'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                            <input name="tags" value={form.tags} onChange={handleChange} className="input" placeholder="caste, unity, faith" />
                        </div>
                        <div className="flex items-end pb-0.5">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.published}
                                    onChange={e => setForm(p => ({ ...p, published: e.target.checked }))}
                                    className="w-4 h-4 accent-brand-500" />
                                <span className="text-sm font-medium">Publish immediately</span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Saving...' : (editing ? 'Update Post' : 'Create Post')}
                    </button>
                </form>
            )}

            <div className="space-y-3">
                {posts.map(post => (
                    <div key={post._id} className="card p-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-dark truncate">{post.titleTamil || post.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="badge bg-gray-100 text-gray-600 capitalize">{post.category}</span>
                                <span className={`badge ${post.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {post.published ? 'Published' : 'Draft'}
                                </span>
                                <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(post)} className="btn-outline text-xs py-1 px-3">Edit</button>
                            <button onClick={() => handleDelete(post._id)} className="text-xs px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}