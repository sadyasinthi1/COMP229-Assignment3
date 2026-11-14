import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import Contact from './pages/Contact';
import Education from './pages/Education';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';
import Services from './pages/Services';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './auth/AuthContext';

function AdminRoute() {
  const { user, verifying } = useAuth();
  if (verifying) return <div className="page-shell loading-note">Checking your session...</div>;
  return user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/signin" replace />;
}

export default function App() {
  return <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/education" element={<Education />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signin" element={<AuthPage mode="signin" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route path="/admin" element={<AdminRoute />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>;
}
