import { useState, useEffect } from 'react';
import { qaAPI } from '../api/axios.js';
import toast from 'react-hot-toast';

const CATEGORIES = ['all', 'theology', 'caste', 'marriage', 'general'];

export default function QAPage() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [expanded, setExpanded] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ question: '', askedBy: '', category: 'general' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const params = category !== 'all' ? { category } : {};
        setLoading(true);
        qaAPI.getAll(params)
            .then(r => setQuestions(r.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [category]);

    const submit = async (e) => {
        e.preventDefault();
        if (!form.question.trim()) return;
        setSubmitting(true);
        try {
            await qaAPI.create(form);
            toast.success('Question submitted! We will answer soon.');
            setForm({ question: '', askedBy: '', category: 'general' });
            setShowForm(false);
        } catch {
            toast.error('Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="section-title">Q &amp; A</h1>
                    <p className="font-tamil text-gray-500">கேள்வி — பதில்கள்</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    + Ask a Question
                </button>
            </div>

            {/* Ask form */}
            {showForm && (
                <form onSubmit={submit} className="card p-6 mb-8 space-y-4">
                    <h3 className="font-display font-semibold text-lg">Ask Your Question</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Question <span className="font-tamil text-xs text-gray-400">(உங்கள் கேள்வி)</span>
                        </label>
                        <textarea
                            rows={3} required
                            value={form.question}
                            onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
                            placeholder="Type your question here... (Tamil or English)"
                            className="input resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name (optional)</label>
                            <input
                                type="text" value={form.askedBy} placeholder="Anonymous"
                                onChange={e => setForm(p => ({ ...p, askedBy: e.target.value }))}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                className="input">
                                {['theology', 'caste', 'marriage', 'general'].map(c => (
                                    <option key={c} value={c} className="capitalize">{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" disabled={submitting} className="btn-primary">
                            {submitting ? 'Submitting...' : 'Submit Question'}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
                    </div>
                </form>
            )}

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setCategory(c)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors
              ${category === c ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}>
                        {c}
                    </button>
                ))}
            </div>

            {/* Questions list */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="card p-5 animate-pulse space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-100 rounded w-1/3" />
                        </div>
                    ))}
                </div>
            ) : questions.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-5xl mb-4">❓</p>
                    <p className="font-tamil">கேள்விகள் இல்லை</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {questions.map(q => (
                        <div key={q._id} className="card overflow-visible">
                            <button
                                onClick={() => setExpanded(expanded === q._id ? null : q._id)}
                                className="w-full text-left p-5 flex items-start gap-3"
                            >
                                <span className="text-brand-400 text-lg mt-0.5 flex-shrink-0">Q</span>
                                <div className="flex-1">
                                    <p className="font-tamil font-medium text-dark leading-relaxed">{q.question}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="badge bg-gray-100 text-gray-600 capitalize">{q.category}</span>
                                        <span className="text-xs text-gray-400">{q.askedBy}</span>
                                        <span className="text-xs text-gray-400">{q.answers.length} answer{q.answers.length !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                                <span className={`text-gray-400 transition-transform flex-shrink-0 ${expanded === q._id ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {expanded === q._id && (
                                <div className="border-t border-gray-100 px-5 pb-5">
                                    {q.answers.length === 0 ? (
                                        <p className="text-sm text-gray-400 py-4 font-tamil">இன்னும் பதில் இல்லை — விரைவில் பதிலளிப்போம்.</p>
                                    ) : (
                                        q.answers.map((a, i) => (
                                            <div key={i} className="py-4 border-b border-gray-50 last:border-0">
                                                <div className="flex gap-3">
                                                    <span className="text-brand-500 font-bold text-lg flex-shrink-0">A</span>
                                                    <div>
                                                        <p className="font-tamil text-sm leading-loose text-gray-700">{a.content}</p>
                                                        <p className="text-xs text-gray-400 mt-2">
                                                            — {a.authorName}
                                                            {a.isOfficial && <span className="ml-2 badge bg-brand-100 text-brand-700">Official</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}