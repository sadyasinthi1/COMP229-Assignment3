import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/portfolioData';
import { api } from '../api';

export default function Projects() {
  const [databaseProjects, setDatabaseProjects] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    api('/projects').then(data => { if (active) setDatabaseProjects(data); })
      .catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, []);
  return <>
    <PageHeader eyebrow="Projects" title="Selected work"
      description="A selection of projects spanning full-stack development, AI and machine learning." />
    <section className="project-grid page-shell">
      {projects.map(project => <ProjectCard key={project.title} project={project} />)}
    </section>
    {databaseProjects.length > 0 && <section className="page-shell db-section" aria-label="MongoDB projects">
      <h2>Additional projects</h2><p className="muted">These records are loaded from MongoDB.</p>
      <div className="project-grid db-grid">
        {databaseProjects.map(item => <article className="project-card" key={item._id}>
          <div className="db-project-art">PROJECT</div>
          <div className="project-card-body"><p className="eyebrow">Database Project</p>
            <h2>{item.title}</h2><p>{item.description}</p>
            <p><strong>Author:</strong> {item.firstname} {item.lastname}</p>
            <p><strong>Completion:</strong> {item.completion ? new Date(item.completion).toLocaleDateString() : 'Not specified'}</p>
          </div>
        </article>)}
      </div>
    </section>}
    {error && <p className="page-shell muted db-warning">MongoDB projects are temporarily unavailable: {error}</p>}
  </>;
}
