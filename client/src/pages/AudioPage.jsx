import { useState, useEffect, useRef } from 'react';
import { audioAPI } from '../api/axios.js';

const CATEGORIES = ['all', 'sermon', 'worship', 'meditation', 'prayer'];

export default function AudioPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [playing, setPlaying] = useState(null); // { id, url, title }
    const audioRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const params = category !== 'all' ? { category } : {};
        setLoading(true);
        audioAPI.getAll(params)
            .then(r => setItems(r.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [category]);

    const play = (item) => {
        if (playing?.id === item._id) {
            audioRef.current?.paused ? audioRef.current.play() : audioRef.current.pause();
            return;
        }
        setPlaying({ id: item._id, url: item.audioUrl, title: item.title, titleTamil: item.titleTamil });
        setProgress(0);
    };

    useEffect(() => {
        if (playing && audioRef.current) {
            audioRef.current.src = playing.url;
            audioRef.current.play();
        }
    }, [playing]);

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
        setDuration(audioRef.current.duration || 0);
    };

    const seek = (e) => {
        if (!audioRef.current) return;
        const pct = e.target.value / 100;
        audioRef.current.currentTime = pct * audioRef.current.duration;
    };

    const formatTime = (s) => {
        if (!s || isNaN(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="section-title">Audio Library</h1>
                <p className="font-tamil text-gray-500">இறைச்செய்திகள் &amp; ஆராதனை பாடல்கள்</p>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-8">
                {CATEGORIES.map(c => (
                    <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors
              ${category === c ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="card p-5 animate-pulse space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-5xl mb-4">🎵</p>
                    <p className="font-tamil">ஆடியோ கோப்புகள் இல்லை</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                        <AudioCard
                            key={item._id}
                            item={item}
                            isPlaying={playing?.id === item._id}
                            onPlay={() => play(item)}
                        />
                    ))}
                </div>
            )}

            {/* Sticky player */}
            {playing && (
                <div className="fixed bottom-0 left-0 right-0 bg-dark text-cream px-4 py-3 border-t border-white/10 z-50 shadow-xl">
                    <audio
                        ref={audioRef}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => setPlaying(null)}
                    />
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-4 mb-2">
                            <button
                                onClick={() => audioRef.current?.paused ? audioRef.current.play() : audioRef.current.pause()}
                                className="w-9 h-9 flex items-center justify-center bg-brand-500 hover:bg-brand-400 rounded-full transition-colors flex-shrink-0"
                            >
                                {audioRef.current?.paused ? '▶' : '⏸'}
                            </button>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{playing.titleTamil || playing.title}</p>
                                <p className="text-xs text-cream/40">Now playing</p>
                            </div>
                            <button onClick={() => setPlaying(null)} className="text-cream/40 hover:text-cream text-xl leading-none">×</button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-cream/40 w-8">{formatTime(audioRef.current?.currentTime)}</span>
                            <input
                                type="range" min="0" max="100" value={progress}
                                onChange={seek}
                                className="audio-progress flex-1"
                            />
                            <span className="text-xs text-cream/40 w-8">{formatTime(duration)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function AudioCard({ item, isPlaying, onPlay }) {
    const categoryIcons = { sermon: '🎙️', worship: '🎵', meditation: '🙏', prayer: '✝️' };

    return (
        <div className={`card p-5 flex gap-4 items-start cursor-pointer transition-all ${isPlaying ? 'ring-2 ring-brand-400' : ''}`}
            onClick={onPlay}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl
        ${isPlaying ? 'bg-brand-500 animate-pulse' : 'bg-brand-100'}`}>
                {isPlaying ? '🔊' : (categoryIcons[item.category] || '🎵')}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-tamil font-medium text-dark text-sm leading-snug line-clamp-2">
                    {item.titleTamil || item.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">{item.speaker}</p>
                <div className="flex items-center gap-3 mt-2">
                    <span className={`badge text-xs ${item.category === 'sermon' ? 'bg-purple-100 text-purple-700' :
                        item.category === 'worship' ? 'bg-pink-100 text-pink-700' :
                            'bg-gray-100 text-gray-600'}`}>
                        {item.category}
                    </span>
                    {item.plays > 0 && <span className="text-xs text-gray-400">▶ {item.plays}</span>}
                </div>
            </div>
        </div>
    );
}