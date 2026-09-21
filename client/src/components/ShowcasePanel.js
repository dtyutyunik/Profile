function ShowcasePanel({ title, eyebrow, items, onExplore }) {
  return (
    <section className="showcase-panel" aria-label={title}>
      <p className="showcase-panel__eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      <div className="showcase-panel__items">
        {items.map((item) => (
          <article key={item.title}>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
            {item.href && (
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.linkLabel || "Explore"}
              </a>
            )}
          </article>
        ))}
      </div>
      {onExplore && (
        <button type="button" className="career-reel__cta" onClick={onExplore}>
          Explore my travel tools <span aria-hidden="true">↗</span>
        </button>
      )}
    </section>
  );
}
export default ShowcasePanel;
