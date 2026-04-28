import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI } from '../api/axios.js';

export default function PostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        postsAPI.getBySlug(slug)
            .then(r => setPost(r.data.data))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return (
        <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="space-y-2">
                {[...Array(6)].map((_, i) => <div key={i} className="h-3 bg-gray-100 rounded" />)}
            </div>
        </div>
    );

    if (error || !post) return (
        <div className="text-center py-24">
            <p className="text-5xl mb-4">📖</p>
            <h2 className="font-display text-2xl mb-2">Post not found</h2>
            <Link to="/" className="btn-primary mt-4 inline-flex">Go Home</Link>
        </div>
    );

    return (
        <article className="max-w-3xl mx-auto px-4 py-10">
            <Link to="/" className="text-sm text-brand-500 hover:underline mb-6 inline-block">← Back</Link>

            {post.coverImage && (
                <img src={post.coverImage} alt={post.title}
                    className="w-full rounded-2xl object-cover max-h-96 mb-8" />
            )}

            <header className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <span className="badge bg-brand-100 text-brand-700 capitalize">{post.category}</span>
                    {post.tags?.map(tag => (
                        <span key={tag} className="badge bg-gray-100 text-gray-600">#{tag}</span>
                    ))}
                </div>
                {post.titleTamil && (
                    <h1 className="font-display text-3xl font-bold text-dark mb-2 tamil leading-snug">{post.titleTamil}</h1>
                )}
                {post.titleTamil !== post.title && (
                    <h2 className="font-display text-xl text-gray-500 mb-4">{post.title}</h2>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span>By {post.author?.name}</span>
                    <span>·</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span>·</span>
                    <span>👁 {post.views}</span>
                </div>
            </header>

            {post.contentTamil && (
                <div className="prose max-w-none font-tamil text-dark leading-loose text-[17px] mb-8 whitespace-pre-wrap">
                    {post.contentTamil}
                </div>
            )}

            {post.content && (
                <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-6">
                    {post.content}
                </div>
            )}
        </article>
    );
}