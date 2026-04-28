import { useState, useEffect } from 'react';
import { matrimonialAPI } from '../api/axios.js';

export default function MatrimonialPage() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gender, setGender] = useState('all');
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const params = gender !== 'all' ? { gender } : {};
        setLoading(true);
        matrimonialAPI.getAll(params)
            .then(r => setListings(r.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [gender]);

    const calcAge = (dob) => {
        const diff = Date.now() - new Date(dob).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="section-title">Matrimonial</h1>
                <p className="font-tamil text-gray-500">திருமண தகவல்கள் — சாதி மறுப்பு கொள்கை</p>
            </div>

            {/* Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
                <p className="font-semibold mb-1">📌 Important Notice</p>
                <p className="font-tamil leading-relaxed">
                    இங்கு பதிவு செய்தவர்கள் சாதி மறுப்பு கொள்கையை ஏற்றுக்கொண்டவர்கள். தொடர்பு விவரங்களுக்கு நேரடியாக தொடர்பு கொள்ளவும்.
                </p>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6">
                {['all', 'male', 'female'].map(g => (
                    <button key={g} onClick={() => setGender(g)}
                        className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-colors
              ${gender === g ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'}`}>
                        {g === 'all' ? 'All / அனைவரும்' : g === 'male' ? 'Groom / மணமகன்' : 'Bride / மணமகள்'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="card p-5 animate-pulse space-y-3">
                            <div className="flex gap-3">
                                <div className="w-16 h-16 rounded-full bg-gray-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : listings.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-5xl mb-4">💍</p>
                    <p className="font-tamil">தகவல்கள் இல்லை</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {listings.map(item => (
                        <div key={item._id} className="card p-5 cursor-pointer hover:ring-2 hover:ring-brand-300 transition-all"
                            onClick={() => setSelected(item)}>
                            <div className="flex gap-4 items-start">
                                {item.photo ? (
                                    <img src={item.photo} alt="" className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                                ) : (
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0
                    ${item.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'}`}>
                                        {item.gender === 'male' ? '👨' : '👩'}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-dark">{item.name}</p>
                                    <p className="text-sm text-gray-500">{calcAge(item.dateOfBirth)} yrs · {item.location}</p>
                                    {item.education && <p className="text-xs text-gray-400 mt-1">{item.education}</p>}
                                    {item.church && <p className="text-xs text-brand-500 mt-1">⛪ {item.church}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail modal */}
            {selected && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelected(null)}>
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="font-display text-xl font-semibold">{selected.name}</h2>
                            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                        </div>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p><span className="font-medium">Age:</span> {calcAge(selected.dateOfBirth)} years</p>
                            <p><span className="font-medium">Location:</span> {selected.location}</p>
                            {selected.height && <p><span className="font-medium">Height:</span> {selected.height}</p>}
                            {selected.education && <p><span className="font-medium">Education:</span> {selected.education}</p>}
                            {selected.occupation && <p><span className="font-medium">Occupation:</span> {selected.occupation}</p>}
                            {selected.church && <p><span className="font-medium">Church:</span> {selected.church}</p>}
                            {selected.about && <p className="font-tamil leading-relaxed mt-3 text-gray-600">{selected.about}</p>}
                        </div>
                        <div className="mt-5 pt-4 border-t border-gray-100 text-sm text-gray-500">
                            <p>📞 For contact details, please reach CCDM directly:</p>
                            <a href="https://wa.me/919080490801" className="text-brand-500 font-medium hover:underline">
                                WhatsApp: 9080490801
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}