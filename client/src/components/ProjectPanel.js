function ProjectPanel({ project, onClose }) {
  if (!project) return null;
  const href =
    project.href ||
    `mailto:dmitriy.tyutyunik@gmail.com?subject=${encodeURIComponent(`Let's discuss ${project.title}`)}`;
  return (
    <aside className="project-panel" aria-live="polite">
      <button
        type="button"
        className="project-panel__dismiss"
        aria-label="Back to all projects"
        onClick={onClose}
      >
        ×
      </button>
      <p className="project-panel__type">{project.type}</p>
      <h3>{project.title}</h3>
      <strong>{project.metric}</strong>
      <div className="project-panel__actions">
        <a
          href={href}
          target={project.href ? "_blank" : undefined}
          rel={project.href ? "noreferrer" : undefined}
        >
          {project.linkLabel}
        </a>
      </div>
      <p>{project.description}</p>
    </aside>
  );
}
export default ProjectPanel;
