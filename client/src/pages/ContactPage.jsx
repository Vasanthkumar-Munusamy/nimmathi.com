import { useState } from 'react';
import { contactAPI } from '../api/axios.js';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await contactAPI.send(form);
            toast.success('Message sent! We will get back to you soon.');
            setForm({ name: '', email: '', phone: '', message: '' });
        } catch {
            toast.error('Failed to send message. Please try again or contact us directly.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="section-title">Contact Us</h1>
                <p className="font-tamil text-gray-500">தொடர்பு கொள்ள</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Contact info */}
                <div className="space-y-6">
                    <div className="card p-6">
                        <h3 className="font-display font-semibold text-lg mb-4">Direct Contact</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <span className="text-2xl">👤</span>
                                <div>
                                    <p className="font-medium text-dark">Bro. Augustine (Agathiyan)</p>
                                    <p className="text-sm text-gray-500">CCDM Ministry Leader</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-center">
                                <span className="text-2xl">📞</span>
                                <a href="tel:9941402590" className="text-brand-600 hover:underline font-medium">9941402590</a>
                            </div>
                            <div className="flex gap-3 items-center">
                                <span className="text-2xl">💬</span>
                                <a href="https://wa.me/919080490801" target="_blank" rel="noreferrer"
                                    className="text-brand-600 hover:underline font-medium">
                                    9080490801 (WhatsApp)
                                </a>
                            </div>
                            <div className="flex gap-3 items-center">
                                <span className="text-2xl">✉️</span>
                                <a href="mailto:mananimmathi@gmail.com" className="text-brand-600 hover:underline font-medium break-all">
                                    mananimmathi@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100">
                        <p className="font-tamil leading-loose text-gray-700 text-sm">
                            முடியுமென்றால், இந்த இணைப்பை சொடுக்கி வாட்சப் எண்ணுக்கு உங்கள் முகவரியை அனுப்புங்கள்.
                        </p>
                        <a
                            href="https://wa.link/5tv3t4"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 btn-primary inline-flex bg-green-600 hover:bg-green-700"
                        >
                            📲 WhatsApp us
                        </a>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                    <h3 className="font-display font-semibold text-lg">Send a Message</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input name="name" required value={form.name} onChange={handleChange}
                            placeholder="Your name" className="input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input name="email" type="email" required value={form.email} onChange={handleChange}
                            placeholder="your@email.com" className="input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                        <input name="phone" value={form.phone} onChange={handleChange}
                            placeholder="Your phone number" className="input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                        <textarea name="message" rows={5} required value={form.message} onChange={handleChange}
                            placeholder="Write your message here..." className="input resize-none" />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                        {submitting ? 'Sending...' : '📤 Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
}