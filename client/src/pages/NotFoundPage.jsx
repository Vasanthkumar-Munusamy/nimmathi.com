import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <span className="text-7xl mb-6">🕊️</span>
            <h1 className="font-display text-4xl font-bold text-dark mb-3">404</h1>
            <p className="font-tamil text-gray-500 mb-2">இந்த பக்கம் கிடைக்கவில்லை</p>
            <p className="text-gray-400 text-sm mb-8">The page you're looking for doesn't exist.</p>
            <Link to="/" className="btn-primary">← Go Home</Link>
        </div>
    );
}