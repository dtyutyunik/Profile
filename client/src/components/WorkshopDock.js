function WorkshopDock({ projects, activeProject, onSelect }) {
  return (
    <section className="workshop-dock" aria-label="Workshop projects">
      <p>Choose an experiment</p>
      <div>
        {projects.map((project) => (
          <button
            type="button"
            key={project.id}
            aria-pressed={activeProject === project.id}
            onClick={() => onSelect(project.id)}
          >
            <strong>{project.title}</strong>
            <span>{project.metric}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
export default WorkshopDock;
