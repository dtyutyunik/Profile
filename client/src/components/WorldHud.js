function WorldHud({ destinations, activeDestination, onNavigate }) {
  return (
    <nav className="quick-nav" aria-label="Quick navigation">
      <button
        type="button"
        aria-current={activeDestination === "home" ? "true" : undefined}
        onClick={() => onNavigate("home")}
      >
        <span className="nav-symbol" aria-hidden="true">
          ⌂
        </span>{" "}
        Overview
      </button>
      {destinations.map((destination) => (
        <button
          key={destination.id}
          type="button"
          aria-current={
            activeDestination === destination.id ? "true" : undefined
          }
          onClick={() => onNavigate(destination.id)}
        >
          <span className="nav-number" aria-hidden="true">
            0{destinations.indexOf(destination) + 1}
          </span>
          {destination.navLabel}
        </button>
      ))}
    </nav>
  );
}

export default WorldHud;
