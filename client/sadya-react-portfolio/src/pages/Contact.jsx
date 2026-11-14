import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { api } from '../api';

const emptyForm = { firstName: '', lastName: '', contactNumber: '', emailAddress: '', message: '' };

export default function Contact() {
  const [formValues, setFormValues] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFormValues(currentValues => ({ ...currentValues, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(''); setBusy(true);
    try {
      // Public messages use their own collection; the Contact CRUD endpoints remain Admin-only for writes.
      await api('/contact-messages', { method: 'POST', data: {
        firstname: formValues.firstName,
        lastname: formValues.lastName,
        contactNumber: formValues.contactNumber,
        email: formValues.emailAddress,
        message: formValues.message,
      } });
      navigate('/', { state: { contactSubmitted: true } });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <>
    <PageHeader eyebrow="Contact" title="Let’s connect"
      description="Use the form below to send your contact information and message." />
    <section className="contact-grid page-shell">
      <aside className="contact-panel">
        <h2>Contact information</h2>
        <p><strong>Location:</strong> Toronto, Ontario</p>
        <p><strong>Email:</strong> <a href="mailto:sadyasinthi1@gmail.com">sadyasinthi1@gmail.com</a></p>
        <p><strong>Portfolio:</strong> <a href="https://www.sadyasinthi.com" target="_blank" rel="noreferrer">www.sadyasinthi.com</a></p>
        <p className="muted">I’m interested in data, software development, AI/ML and analytics opportunities.</p>
      </aside>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>First Name<input name="firstName" value={formValues.firstName} onChange={handleFieldChange} required /></label>
          <label>Last Name<input name="lastName" value={formValues.lastName} onChange={handleFieldChange} required /></label>
        </div>
        <label>Contact Number<input name="contactNumber" type="tel" value={formValues.contactNumber} onChange={handleFieldChange} required /></label>
        <label>Email Address<input name="emailAddress" type="email" value={formValues.emailAddress} onChange={handleFieldChange} required /></label>
        <label>Message<textarea name="message" rows="6" value={formValues.message} onChange={handleFieldChange} required /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button primary" type="submit" disabled={busy}>{busy ? 'Sending...' : 'Send Message'}</button>
      </form>
    </section>
  </>;
}
