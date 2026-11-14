import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { api } from '../api';

// Original Assignment 1 credentials intentionally preserved.
const education = [
  { credential: 'Software Engineering Technician (AI Program)', institution: 'Centennial College', dates: '2022',
    detail: 'Focused on software development, artificial intelligence, programming, databases, web development, and application development.' },
  { credential: 'Certificate in French Language Studies', institution: 'Alliance Française de Dhaka', dates: '2018 – 2021',
    detail: 'Completed French language studies with a focus on written and verbal communication.' },
];

export default function Education() {
  const [qualifications, setQualifications] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    api('/qualifications').then(data => { if (active) setQualifications(data); })
      .catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, []);

  return <>
    <PageHeader eyebrow="Education" title="Education & Qualifications"
      description="My education combines software engineering, artificial intelligence, and language studies." />
    <section className="timeline page-shell">
      {education.map(item => <article className="timeline-item" key={`${item.credential}-${item.institution}`}>
        <div className="timeline-dot" aria-hidden="true" />
        <div><p className="eyebrow">{item.dates}</p><h2>{item.credential}</h2>
          <p className="institution">{item.institution}</p><p>{item.detail}</p></div>
      </article>)}
    </section>
    {qualifications.length > 0 && <section className="timeline page-shell db-section" aria-label="MongoDB qualifications">
      <h2>Additional qualifications</h2><p className="muted">These records are loaded from MongoDB.</p>
      {qualifications.map(item => <article className="timeline-item" key={item._id}>
        <div className="timeline-dot" aria-hidden="true" />
        <div><p className="eyebrow">{item.completion ? new Date(item.completion).toLocaleDateString() : ''}</p>
          <h2>{item.title}</h2><p className="institution">{item.firstname} {item.lastname}</p>
          <p>{item.description}</p></div>
      </article>)}
    </section>}
    {error && <p className="page-shell muted db-warning">MongoDB qualifications are temporarily unavailable: {error}</p>}
  </>;
}
