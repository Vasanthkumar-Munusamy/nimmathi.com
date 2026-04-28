import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import AdminPosts from '../components/ui/AdminPosts.jsx';
import AdminAudio from '../components/ui/AdminAudio.jsx';
import AdminMatrimonial from '../components/ui/AdminMatrimonial.jsx';
import AdminQA from '../components/ui/AdminQA.jsx';

const TABS = [
    { id: 'posts', label: 'Posts', icon: '📝' },
    { id: 'audio', label: 'Audio', icon: '🎵' },
    { id: 'matrimonial', label: 'Matrimonial', icon: '💍' },
    { id: 'qa', label: 'Q & A', icon: '❓' },
];

export default function AdminPage() {
    const { user } = useAuth();
    const [tab, setTab] = useState('posts');

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="section-title">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm">Logged in as <strong>{user?.name}</strong></p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-brand-50 p-1 rounded-xl mb-8 w-fit">
                {TABS.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === t.id ? 'bg-white shadow text-brand-600' : 'text-gray-500 hover:text-brand-500'}`}
                    >
                        <span>{t.icon}</span> {t.label}
                    </button>
                ))}
            </div>

            {/* Panel */}
            <div className="page-enter" key={tab}>
                {tab === 'posts' && <AdminPosts />}
                {tab === 'audio' && <AdminAudio />}
                {tab === 'matrimonial' && <AdminMatrimonial />}
                {tab === 'qa' && <AdminQA />}
            </div>
        </div>
    );
}