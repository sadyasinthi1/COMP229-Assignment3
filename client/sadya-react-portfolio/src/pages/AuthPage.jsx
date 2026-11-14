import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api';

export default function AuthPage({ mode }) {
  const signup = mode === 'signup';
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;

  function handleChange(e) { setValues(current => ({ ...current, [e.target.name]: e.target.value })); }
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      if (signup) await api('/users', { method: 'POST', data: values });
      const result = await signIn(values.email, values.password);
      navigate(result.user.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <>
    <PageHeader eyebrow="My Portfolio" title={signup ? 'Create an account' : 'Welcome back'}
      description={signup ? 'Sign up as a user to explore the portfolio.' : 'Sign in to view your account. Administrators can manage portfolio records.'} />
    <section className="page-shell auth-section">
      <form className="contact-form auth-form" onSubmit={submit}>
        <h2>{signup ? 'Sign Up' : 'Sign In'}</h2>
        {signup && <label>Full Name<input name="name" autoComplete="name" required value={values.name} onChange={handleChange} /></label>}
        <label>Email Address<input name="email" type="email" required autoComplete="email" value={values.email} onChange={handleChange} /></label>
        <label>Password<input name="password" type="password" required minLength={signup ? 8 : undefined}
          autoComplete={signup ? 'new-password' : 'current-password'} value={values.password} onChange={handleChange} /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button primary" disabled={busy}>{busy ? 'Please wait...' : signup ? 'Create Account' : 'Sign In'}</button>
        <p className="muted">{signup ? 'Already registered? ' : 'Need an account? '}
          <Link className="text-link" to={signup ? '/signin' : '/signup'}>{signup ? 'Sign In' : 'Sign Up'}</Link></p>
      </form>
      <aside className="mission-card auth-note"><p className="eyebrow">Account access</p>
        <h2>Keep exploring.</h2><p>Regular users can view portfolio information. Administrators can securely add, edit, and delete MongoDB records.</p>
      </aside>
    </section>
  </>;
}
