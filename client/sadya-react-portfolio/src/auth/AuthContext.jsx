import { createContext, useContext, useEffect, useState } from 'react';
import { api, getSession, saveSession } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSession);
  const [verifying, setVerifying] = useState(Boolean(getSession()));

  useEffect(() => {
    if (!session?.token) { setVerifying(false); return; }
    let ignore = false;
    setVerifying(true);
    api('/auth/profile', { token: session.token })
      .then(user => {
        if (ignore) return;
        const updated = { token: session.token, user };
        saveSession(updated);
        setSession(updated);
      })
      .catch(() => {
        if (ignore) return;
        saveSession(null);
        setSession(null);
      })
      .finally(() => { if (!ignore) setVerifying(false); });
    return () => { ignore = true; };
  }, [session?.token]);

  async function signIn(email, password) {
    const result = await api('/auth/signin', { method: 'POST', data: { email, password } });
    const next = { token: result.token, user: result.user };
    saveSession(next);
    setSession(next);
    return next;
  }

  async function signOut() {
    const token = session?.token;
    saveSession(null);
    setSession(null);
    if (token) {
      try { await api('/auth/signout', { method: 'POST', token }); }
      catch { /* Clear local session even if backend is offline. */ }
    }
  }

  return <AuthContext.Provider value={{ session, user: session?.user, token: session?.token, verifying, signIn, signOut }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
}
