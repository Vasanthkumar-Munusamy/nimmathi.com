import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const navLinks = [
    { to: '/', label: 'Home', tamil: 'முகப்பு' },
    { to: '/audio', label: 'Audio', tamil: 'ஆடியோ' },
    { to: '/matrimonial', label: 'Matrimonial', tamil: 'திருமணம்' },
    { to: '/qa', label: 'Q & A', tamil: 'கேள்வி-பதில்' },
    { to: '/contact', label: 'Contact', tamil: 'தொடர்பு' },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { user, logout, isAdmin } = useAuth();

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-brand-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex flex-col leading-tight" onClick={() => setOpen(false)}>
                    <span className="font-display font-bold text-xl text-brand-600 tracking-tight">நிம்மதி</span>
                    <span className="text-[10px] text-gray-400 tracking-widest uppercase font-sans">CCDM Ministry</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map(({ to, label, tamil }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `px-3 py-1.5 rounded-md text-sm transition-colors flex flex-col items-center leading-tight
                ${isActive
                                    ? 'bg-brand-50 text-brand-600 font-medium'
                                    : 'text-gray-600 hover:text-brand-500 hover:bg-brand-50'}`
                            }
                        >
                            <span className="font-tamil text-[13px]">{tamil}</span>
                            <span className="text-[10px] text-gray-400">{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Auth / Admin buttons */}
                <div className="hidden md:flex items-center gap-2">
                    {user ? (
                        <>
                            {isAdmin && (
                                <Link to="/admin" className="text-sm text-brand-600 hover:underline font-medium">
                                    Admin
                                </Link>
                            )}
                            <button onClick={logout} className="btn-outline text-sm py-1.5 px-4">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn-primary text-sm py-1.5 px-4">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden p-2 rounded-md text-gray-600 hover:bg-brand-50"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
                    <div className={`w-5 h-0.5 bg-current mb-1 transition-all ${open ? 'opacity-0' : ''}`} />
                    <div className={`w-5 h-0.5 bg-current transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-white border-t border-brand-100 px-4 pb-4">
                    {navLinks.map(({ to, label, tamil }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `flex justify-between items-center py-3 border-b border-gray-100 text-sm
                ${isActive ? 'text-brand-600 font-medium' : 'text-gray-700'}`
                            }
                        >
                            <span className="font-tamil">{tamil}</span>
                            <span className="text-gray-400 text-xs">{label}</span>
                        </NavLink>
                    ))}
                    <div className="pt-3 flex gap-2">
                        {user ? (
                            <>
                                {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="btn-outline text-sm flex-1 text-center">Admin</Link>}
                                <button onClick={() => { logout(); setOpen(false); }} className="btn-primary text-sm flex-1">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setOpen(false)} className="btn-primary text-sm w-full text-center">Login</Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}