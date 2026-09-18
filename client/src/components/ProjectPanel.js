function ProjectPanel({ project, onClose }) {
  if (!project) return null;
  return (
    <aside className="project-panel" aria-live="polite">
      <p className="project-panel__type">{project.type}</p>
      <h3>{project.title}</h3>
      <strong>{project.metric}</strong>
      <p>{project.description}</p>
      <div className="project-panel__actions">
        {project.href && <a href={project.href} target="_blank" rel="noreferrer">{project.linkLabel || 'Visit project'}</a>}
        <button type="button" onClick={onClose}>Close project</button>
      </div>
    </aside>
  );
}
export default ProjectPanel;
