function CareerMetrics({ metrics }) {
  return (
    <section className="career-metrics" aria-label="Career highlights">
      {metrics.map((metric) => (
        <div className="career-metric" key={metric.label}>
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
        </div>
      ))}
    </section>
  );
}
export default CareerMetrics;
