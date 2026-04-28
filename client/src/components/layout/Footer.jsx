import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-dark text-cream/70 mt-16">
            <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand */}
                <div>
                    <h3 className="font-display text-cream text-lg mb-2">நிம்மதி</h3>
                    <p className="text-sm leading-relaxed font-tamil text-cream/60">
                        கிறிஸ்தவ சாதி மறுப்பாளர் இயக்கம் (CCDM)
                    </p>
                    <p className="text-xs mt-3 text-cream/40">
                        Christian Caste Denial Movement
                    </p>
                </div>

                {/* Quick links */}
                <div>
                    <h4 className="text-cream font-medium mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
                    <ul className="space-y-2">
                        {[
                            { to: '/', label: 'Home — முகப்பு' },
                            { to: '/audio', label: 'Audio — ஆடியோ' },
                            { to: '/matrimonial', label: 'Matrimonial — திருமணம்' },
                            { to: '/qa', label: 'Q&A — கேள்வி பதில்' },
                            { to: '/contact', label: 'Contact — தொடர்பு' },
                        ].map(({ to, label }) => (
                            <li key={to}>
                                <Link to={to} className="text-sm hover:text-brand-400 transition-colors font-tamil">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-cream font-medium mb-3 text-sm uppercase tracking-wider">Contact</h4>
                    <div className="space-y-2 text-sm text-cream/60">
                        <p>Bro. Augustine (Agathiyan)</p>
                        <a href="tel:9941402590" className="block hover:text-brand-400 transition-colors">
                            📞 9941402590
                        </a>
                        <a
                            href="https://wa.me/919080490801"
                            target="_blank"
                            rel="noreferrer"
                            className="block hover:text-brand-400 transition-colors"
                        >
                            💬 9080490801 (WhatsApp)
                        </a>
                        <a href="mailto:mananimmathi@gmail.com" className="block hover:text-brand-400 transition-colors">
                            ✉️ mananimmathi@gmail.com
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 text-center py-4 text-xs text-cream/30">
                © {new Date().getFullYear()} நிம்மதி — CCDM. Built with MERN Stack.
            </div>
        </footer>
    );
}