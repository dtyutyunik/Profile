import { useMemo, useState } from 'react';
import './App.css';
import WorldHud from './components/WorldHud';
import DetailPanel from './components/DetailPanel';
import CareerMetrics from './components/CareerMetrics';
import PortfolioWorld from './world/PortfolioWorld';
import { CAREER_METRICS, WORLD_DESTINATIONS } from './data/worldData';

function App() {
  const [activeDestination, setActiveDestination] = useState('home');

  const activeData = useMemo(
    () => WORLD_DESTINATIONS.find((item) => item.id === activeDestination) || null,
    [activeDestination]
  );

  return (
    <main className="portfolio-shell">
      <PortfolioWorld
        activeDestination={activeDestination}
        onSelectDestination={setActiveDestination}
      />

      <WorldHud
        destinations={WORLD_DESTINATIONS}
        activeDestination={activeDestination}
        onNavigate={setActiveDestination}
      />

      <section className="hero-copy" aria-label="Introduction">
        <p className="eyebrow">Senior Frontend + AI Product Engineer</p>
        <h1>Dmitriy Tyutyunik</h1>
        <p>
          I build interfaces, tools, and agentic systems. Explore the world to see
          the story behind the work.
        </p>
        <div className="hero-actions">
          <button type="button" onClick={() => setActiveDestination('workshop')}>
            Enter the workshop
          </button>
          <a href="mailto:dmitriy.tyutyunik@gmail.com">Contact</a>
        </div>
      </section>

      {activeDestination === 'home' && <CareerMetrics metrics={CAREER_METRICS} />}

      <DetailPanel
        destination={activeData}
        onClose={() => setActiveDestination('home')}
      />

      <div className="world-hint" aria-hidden="true">
        Click a destination or use quick navigation
      </div>
    </main>
  );
}

export default App;
