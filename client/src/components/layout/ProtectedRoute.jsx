import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ adminOnly = false }) {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

    return <Outlet />;
}