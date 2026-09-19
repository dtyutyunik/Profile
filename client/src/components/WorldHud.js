function WorldHud({ destinations, activeDestination, onNavigate }) {
  return (
    <nav className="quick-nav" aria-label="Quick navigation">
      <button
        type="button"
        aria-current={activeDestination === 'home' ? 'true' : undefined}
        onClick={() => onNavigate('home')}
      >
        Overview
      </button>
      {destinations.map((destination) => (
        <button
          key={destination.id}
          type="button"
          aria-current={activeDestination === destination.id ? 'true' : undefined}
          onClick={() => onNavigate(destination.id)}
        >
          {destination.navLabel}
        </button>
      ))}
    </nav>
  );
}

export default WorldHud;
