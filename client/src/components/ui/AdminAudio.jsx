import { useState, useEffect } from 'react';
import { audioAPI } from '../../api/axios.js';
import toast from 'react-hot-toast';

export default function AdminAudio() {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', titleTamil: '', category: 'sermon', speaker: 'Bro. Augustine (Agathiyan)' });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const load = () => audioAPI.getAll({ limit: 50 }).then(r => setItems(r.data.data)).catch(console.error);
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) { toast.error('Please select an audio file'); return; }
        setUploading(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            fd.append('audio', file);
            await audioAPI.upload(fd);
            toast.success('Audio uploaded!');
            setShowForm(false); setFile(null);
            setForm({ title: '', titleTamil: '', category: 'sermon', speaker: 'Bro. Augustine (Agathiyan)' });
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally { setUploading(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this audio?')) return;
        await audioAPI.delete(id);
        toast.success('Deleted'); load();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="font-display text-xl font-semibold">Audio ({items.length})</h2>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    {showForm ? 'Cancel' : '+ Upload Audio'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title (English)</label>
                            <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">தலைப்பு (Tamil)</label>
                            <input value={form.titleTamil} onChange={e => setForm(p => ({ ...p, titleTamil: e.target.value }))} className="input font-tamil" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input">
                                {['sermon', 'worship', 'meditation', 'prayer'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Speaker</label>
                            <input value={form.speaker} onChange={e => setForm(p => ({ ...p, speaker: e.target.value }))} className="input" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Audio File (MP3 / WAV)</label>
                        <input type="file" accept="audio/*" required onChange={e => setFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100 cursor-pointer" />
                        {file && <p className="text-xs text-gray-400 mt-1">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
                    </div>
                    <button type="submit" disabled={uploading} className="btn-primary">
                        {uploading ? '⏳ Uploading to Cloudinary...' : '☁️ Upload Audio'}
                    </button>
                </form>
            )}

            <div className="space-y-3">
                {items.map(item => (
                    <div key={item._id} className="card p-4 flex items-center gap-4">
                        <span className="text-2xl">{item.category === 'sermon' ? '🎙️' : '🎵'}</span>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-dark font-tamil truncate">{item.titleTamil || item.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="badge bg-purple-100 text-purple-700 capitalize">{item.category}</span>
                                <span className="text-xs text-gray-400">{item.speaker}</span>
                                <span className="text-xs text-gray-400">▶ {item.plays} plays</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <a href={item.audioUrl} target="_blank" rel="noreferrer"
                                className="btn-outline text-xs py-1 px-3">▶ Play</a>
                            <button onClick={() => handleDelete(item._id)}
                                className="text-xs px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}