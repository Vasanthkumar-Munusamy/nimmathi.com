import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
    const { pathname } = useLocation();
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 page-enter" key={pathname}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}