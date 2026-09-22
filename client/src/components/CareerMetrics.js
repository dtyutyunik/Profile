function CareerMetrics({ metrics, onSelect }) {
  return (
    <section className="career-metrics" aria-label="Career highlights">
      {metrics.map((metric) => (
        <button
          type="button"
          className="career-metric"
          key={metric.label}
          onClick={() => onSelect(metric)}
        >
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
          <span className="career-metric__cta">
            {metric.cta} <i aria-hidden="true">↗</i>
          </span>
        </button>
      ))}
    </section>
  );
}
export default CareerMetrics;
