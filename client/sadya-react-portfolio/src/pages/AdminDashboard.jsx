import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api';
import PageHeader from '../components/PageHeader';

const types = {
  projects: { label: 'Projects', singular: 'Project', fields: [
    ['title', 'Project title', 'text'], ['firstname', 'First name', 'text'],
    ['lastname', 'Last name', 'text'], ['email', 'Email', 'email'],
    ['completion', 'Completion date', 'date'], ['description', 'Description', 'textarea'],
  ] },
  qualifications: { label: 'Education', singular: 'Qualification', fields: [
    ['title', 'Qualification title', 'text'], ['firstname', 'First name', 'text'],
    ['lastname', 'Last name', 'text'], ['email', 'Email', 'email'],
    ['completion', 'Completion date', 'date'], ['description', 'Description', 'textarea'],
  ] },
  contacts: { label: 'Contacts', singular: 'Contact', fields: [
    ['firstname', 'First name', 'text'], ['lastname', 'Last name', 'text'], ['email', 'Email', 'email'],
  ] },
  users: { label: 'Users', singular: 'User', fields: [
    ['name', 'Full name', 'text'], ['email', 'Email', 'email'],
    ['password', 'Password (8+ characters)', 'password'], ['role', 'Role', 'select'],
  ] },
  messages: { label: 'Messages', singular: 'Message', fields: [] },
};

function RecordForm({ kind, initial, onSubmit, onCancel }) {
  const config = types[kind];
  const [values, setValues] = useState(() => Object.fromEntries(config.fields.map(([field]) => [field,
    field === 'completion' ? (initial?.completion || '').slice(0, 10) : initial?.[field] || (field === 'role' ? 'user' : '')
  ])));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const payload = { ...values };
      if (kind === 'users' && initial && !payload.password) delete payload.password;
      await onSubmit(payload);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <form className="contact-form admin-edit-form" onSubmit={submit}>
    <h2>{initial ? 'Edit' : 'Add'} {config.singular}</h2>
    <div className="form-row admin-form-grid">
      {config.fields.map(([field, label, type]) => <label key={field} className={type === 'textarea' ? 'full-field' : ''}>
        {label}
        {type === 'textarea' ? <textarea rows="4" required value={values[field]} onChange={e => setValues(current => ({ ...current, [field]: e.target.value }))} />
          : type === 'select' ? <select name={field} value={values[field]} onChange={e => setValues(current => ({ ...current, [field]: e.target.value }))}>
            <option value="user">User</option><option value="admin">Admin</option></select>
          : <input name={field} type={type} value={values[field]} autoComplete={field === 'password' ? 'new-password' : undefined}
            minLength={type === 'password' ? 8 : undefined}
            required={!(kind === 'users' && initial && field === 'password')}
            onChange={e => setValues(current => ({ ...current, [field]: e.target.value }))} />}
      </label>)}
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="admin-actions">
      <button type="submit" className="button primary" disabled={busy}>{busy ? 'Saving...' : 'Save to MongoDB'}</button>
      <button type="button" className="button secondary" onClick={onCancel}>Cancel</button>
    </div>
  </form>;
}

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [kind, setKind] = useState('projects');
  const [data, setData] = useState({ projects: [], qualifications: [], contacts: [], users: [], messages: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const keys = Object.keys(types);
    Promise.all(keys.map(key => api(`/${key === 'messages' ? 'contact-messages' : key}`, { token })))
      .then(results => { if (active) setData(Object.fromEntries(keys.map((key, index) => [key, results[index]]))); })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, reloadCounter]);

  function switchKind(value) { setKind(value); setEditing(null); setAdding(false); setError(''); setNotice(''); }

  async function save(payload) {
    const path = kind === 'users' && !editing ? '/users/admin' : `/${kind}${editing ? `/${editing._id}` : ''}`;
    await api(path, { method: editing ? 'PUT' : 'POST', data: payload, token });
    setNotice(`${types[kind].singular} saved successfully in MongoDB.`);
    setEditing(null); setAdding(false); setReloadCounter(n => n + 1);
  }

  async function remove(record) {
    if (kind === 'users' && record._id === user?._id) return setError('You cannot delete your own administrator account.');
    if (!window.confirm(`Delete this ${types[kind].singular.toLowerCase()}?`)) return;
    setError(''); setNotice('');
    try {
      const prefix = kind === 'messages' ? 'contact-messages' : kind;
      await api(`/${prefix}/${record._id}`, { method: 'DELETE', token });
      setNotice('Record deleted from MongoDB.');
      setReloadCounter(n => n + 1);
    } catch (err) { setError(err.message); }
  }

  return <>
    <PageHeader eyebrow="Administrator" title="Portfolio Dashboard"
      description="Add, view, update, and delete records in your MongoDB Portfolio database." />
    <section className="page-shell admin-dashboard">
      <div className="admin-summary">
        {Object.entries(types).map(([key, config]) => <div key={key}><span>{config.label}</span><strong>{data[key].length}</strong></div>)}
      </div>
      <div className="admin-tabs" role="tablist" aria-label="Database collections">
        {Object.entries(types).map(([key, config]) => <button type="button" role="tab" aria-selected={kind === key}
          className={kind === key ? 'admin-tab selected' : 'admin-tab'} key={key} onClick={() => switchKind(key)}>{config.label}</button>)}
      </div>
      <div className="admin-heading"><div><h2>{types[kind].label}</h2>
        <p className="muted">{kind === 'messages' ? 'Messages submitted through the public Contact form.' : 'Admin-only create, update, and delete operations.'}</p></div>
        {kind !== 'messages' && <button className="button primary" type="button" onClick={() => { setEditing(null); setAdding(v => !v); }}>{adding ? 'Close Form' : `+ Add ${types[kind].singular}`}</button>}
      </div>
      {notice && <p className="success-banner" role="status">{notice}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {loading ? <p>Loading MongoDB records...</p> : null}
      {(adding || editing) && kind !== 'messages' && <RecordForm key={`${kind}-${editing?._id || 'new'}`} kind={kind} initial={editing}
        onCancel={() => { setEditing(null); setAdding(false); }} onSubmit={save} />}
      {!loading && !data[kind].length && <p className="muted no-records">No records yet. {kind === 'messages' ? 'Messages from the Contact page appear here.' : 'Use Add to create your first record.'}</p>}
      <div className="admin-record-grid">
        {data[kind].map(record => <article className="project-card admin-record" key={record._id}>
          <div className="project-card-body">
            <p className="eyebrow">{types[kind].singular} · MongoDB</p>
            <h3>{record.title || record.name || [record.firstname, record.lastname].filter(Boolean).join(' ')}</h3>
            {record.description && <p>{record.description}</p>}
            {record.message && <p>{record.message}</p>}
            {record.email && <p>{record.email}</p>}
            {record.contactNumber && <p>{record.contactNumber}</p>}
            {record.role && <p><strong>Role:</strong> {record.role}</p>}
            {record.completion && <p><strong>Completion:</strong> {new Date(record.completion).toLocaleDateString()}</p>}
            <div className="admin-actions">
              {kind !== 'messages' && <button type="button" className="button secondary" onClick={() => { setEditing(record); setAdding(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button>}
              <button type="button" className="button danger" onClick={() => remove(record)}>Delete</button>
            </div>
          </div>
        </article>)}
      </div>
      <p className="muted admin-help">View public <Link to="/projects">Projects</Link>, <Link to="/education">Education</Link>, or the <Link to="/contact">Contact form</Link>.</p>
    </section>
  </>;
}
