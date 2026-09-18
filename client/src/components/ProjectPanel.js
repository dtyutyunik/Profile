function ProjectPanel({ project, onClose }) {
  if (!project) return null;
  return (
    <aside className="project-panel" aria-live="polite">
      <p className="project-panel__type">{project.type}</p>
      <h3>{project.title}</h3>
      <strong>{project.metric}</strong>
      <p>{project.description}</p>
      <button type="button" onClick={onClose}>Close project</button>
    </aside>
  );
}
export default ProjectPanel;
