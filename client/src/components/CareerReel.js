function CareerReel({ acts, activeIndex, onChange, onSelectProject }) {
  return (
    <section className="career-reel" aria-label="Career story">
      <div className="career-reel__header">
        <span>{acts[activeIndex].year}</span>
        <span>
          {activeIndex + 1} / {acts.length}
        </span>
      </div>
      <h3>{acts[activeIndex].title}</h3>
      <p>{acts[activeIndex].text}</p>
      {acts[activeIndex].projectId && (
        <button
          type="button"
          className="career-reel__cta"
          onClick={() => onSelectProject(acts[activeIndex].projectId)}
        >
          {acts[activeIndex].cta} <span aria-hidden="true">↗</span>
        </button>
      )}
      <div className="career-reel__controls">
        <button
          type="button"
          disabled={activeIndex === 0}
          onClick={() => onChange(activeIndex - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={activeIndex === acts.length - 1}
          onClick={() => onChange(activeIndex + 1)}
        >
          Next act
        </button>
      </div>
    </section>
  );
}
export default CareerReel;
