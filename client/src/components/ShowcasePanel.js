function ShowcasePanel({ title, eyebrow, items }) {
  return (
    <section className="showcase-panel" aria-label={title}>
      <p className="showcase-panel__eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      <div className="showcase-panel__items">
        {items.map((item) => (
          <article key={item.title}>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export default ShowcasePanel;
