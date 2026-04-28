import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import PostPage from './pages/PostPage.jsx';
import AudioPage from './pages/AudioPage.jsx';
import MatrimonialPage from './pages/MatrimonialPage.jsx';
import QAPage from './pages/QAPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="post/:slug" element={<PostPage />} />
        <Route path="audio" element={<AudioPage />} />
        <Route path="matrimonial" element={<MatrimonialPage />} />
        <Route path="qa" element={<QAPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />

        {/* Admin — protected */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="admin/*" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}