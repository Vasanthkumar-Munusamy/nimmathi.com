import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../api/axios.js';

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        postsAPI.getAll({ limit: 6 })
            .then(r => setPosts(r.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            {/* ── Hero ─────────────────────────────────────── */}
            <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-brand-200 text-sm uppercase tracking-widest mb-3 font-sans">
                        கிறிஸ்தவ சாதி மறுப்பாளர் இயக்கம்
                    </p>
                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        நிம்மதி
                    </h1>
                    <p className="font-tamil text-brand-100 text-lg leading-loose max-w-xl mx-auto">
                        "கிறிஸ்தவர்கள் அனைவரும் ஒரே தகப்பனுடைய பிள்ளைகள்"
                    </p>
                    <p className="text-brand-200 text-sm mt-2 mb-8">
                        Christian Caste Denial Movement (CCDM)
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link to="/audio" className="bg-white text-brand-600 font-medium px-5 py-2.5 rounded-lg hover:bg-brand-50 transition-colors">
                            🎵 Audio Sermons
                        </Link>
                        <Link to="/matrimonial" className="border border-white/50 text-white px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
                            💍 Matrimonial
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Mission strip ────────────────────────────── */}
            <section className="bg-brand-50 border-y border-brand-100 py-8 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    {[
                        { icon: '✝️', title: 'Unity in Christ', desc: 'Preaching caste-free brotherhood among Tamil Christians' },
                        { icon: '🎙️', title: 'Sermons & Songs', desc: 'Audio messages by Bro. Augustine (Agathiyan)' },
                        { icon: '💌', title: 'Matrimonial', desc: 'Helping believers find caste-free life partners' },
                    ].map(({ icon, title, desc }) => (
                        <div key={title} className="flex flex-col items-center gap-2">
                            <span className="text-3xl">{icon}</span>
                            <h3 className="font-semibold text-dark">{title}</h3>
                            <p className="text-sm text-gray-500">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Latest Posts ──────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-4 py-14">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="section-title">Latest Articles</h2>
                        <p className="font-tamil text-gray-500 text-sm">சமீபத்திய கட்டுரைகள்</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-40 bg-brand-100" />
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded w-full" />
                                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-4xl mb-3">📖</p>
                        <p className="font-tamil">இன்னும் கட்டுரைகள் இல்லை</p>
                        <p className="text-sm">No articles yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map(post => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                )}
            </section>

            {/* ── CTA Banner ───────────────────────────────── */}
            <section className="bg-dark text-cream py-14 px-4 text-center">
                <h2 className="font-display text-2xl mb-3">Have a Question?</h2>
                <p className="font-tamil text-cream/60 mb-6">உங்கள் கேள்வியை கேளுங்கள்</p>
                <Link to="/qa" className="btn-primary bg-brand-500 hover:bg-brand-400">
                    Browse Q &amp; A
                </Link>
            </section>
        </div>
    );
}

function PostCard({ post }) {
    const categoryColors = {
        article: 'bg-blue-100 text-blue-700',
        sermon: 'bg-purple-100 text-purple-700',
        testimony: 'bg-green-100 text-green-700',
        announcement: 'bg-amber-100 text-amber-700',
    };

    return (
        <Link to={`/post/${post.slug}`} className="card group block">
            {post.coverImage ? (
                <img src={post.coverImage} alt={post.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
                <div className="w-full h-44 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                    <span className="text-4xl opacity-30">✝️</span>
                </div>
            )}
            <div className="p-5">
                <span className={`badge ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'} mb-3`}>
                    {post.category}
                </span>
                <h3 className="font-display font-semibold text-dark group-hover:text-brand-600 transition-colors line-clamp-2 mb-1">
                    {post.titleTamil || post.title}
                </h3>
                <p className="text-xs text-gray-400 mt-3">
                    {post.author?.name} · {new Date(post.createdAt).toLocaleDateString('ta-IN')}
                </p>
            </div>
        </Link>
    );
}