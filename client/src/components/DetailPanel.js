function DetailPanel({ destination, onClose }) {
  if (!destination) {
    return null;
  }

  return (
    <aside className="detail-panel" aria-live="polite">
      <p className="detail-panel__kicker">{destination.kicker}</p>
      <h2>{destination.title}</h2>
      <p>{destination.summary}</p>
      <button type="button" onClick={onClose}>
        Back to overview
      </button>
    </aside>
  );
}

export default DetailPanel;
