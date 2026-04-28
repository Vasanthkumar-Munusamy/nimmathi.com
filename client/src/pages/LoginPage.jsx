import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await authAPI.login(form);
            login(data.data);
            toast.success(`Welcome, ${data.data.name}!`);
            navigate(data.data.role === 'admin' ? '/admin' : '/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="font-display text-3xl font-bold text-brand-600">நிம்மதி</h1>
                    <p className="text-gray-500 mt-1">Admin Login</p>
                </div>

                <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email" required autoComplete="email"
                            value={form.email}
                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                            placeholder="admin@example.com"
                            className="input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password" required autoComplete="current-password"
                            value={form.password}
                            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                            placeholder="••••••••"
                            className="input"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-4">
                    <Link to="/" className="hover:text-brand-500">← Back to home</Link>
                </p>
            </div>
        </div>
    );
}