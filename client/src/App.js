import { useMemo, useState } from 'react';
import './App.css';
import WorldHud from './components/WorldHud';
import DetailPanel from './components/DetailPanel';
import CareerMetrics from './components/CareerMetrics';
import ProjectPanel from './components/ProjectPanel';
import CareerReel from './components/CareerReel';
import ShowcasePanel from './components/ShowcasePanel';
import WorkshopDock from './components/WorkshopDock';
import PublisherShelf from './components/PublisherShelf';
import PortfolioWorld from './world/PortfolioWorld';
import { CAREER_METRICS, WORLD_DESTINATIONS } from './data/worldData';
import { WORKSHOP_PROJECTS } from './data/workshopProjects';
import { CAREER_ACTS } from './data/careerActs';
import { TRAVEL_HIGHLIGHTS } from './data/travelHighlights';
import { PUBLISHED_BOOKS } from './data/publishedBooks';

function App() {
  const [activeDestination, setActiveDestination] = useState('home');
  const [activeProject, setActiveProject] = useState(null);
  const [careerAct, setCareerAct] = useState(0);

  const navigate = (id) => {
    setActiveDestination(id);
    if (id !== 'workshop') setActiveProject(null);
  };

  const activeData = useMemo(
    () => WORLD_DESTINATIONS.find((item) => item.id === activeDestination) || null,
    [activeDestination]
  );

  return (
    <main className="portfolio-shell">
      <PortfolioWorld
        activeDestination={activeDestination}
        onSelectDestination={navigate}
        projects={WORKSHOP_PROJECTS}
        onSelectProject={setActiveProject}
      />

      <WorldHud
        destinations={WORLD_DESTINATIONS}
        activeDestination={activeDestination}
        onNavigate={navigate}
      />

      <section className={`hero-copy ${activeDestination !== 'home' ? 'hero-copy--compact' : ''}`} aria-label="Introduction">
        <p className="eyebrow">Senior Frontend + AI Product Engineer</p>
        <h1>Dmitriy Tyutyunik</h1>
        <p>
          I build interfaces, tools, and agentic systems. Explore the world to see
          the story behind the work.
        </p>
        <div className="hero-actions">
          <button type="button" onClick={() => navigate('workshop')}>
            Enter the workshop
          </button>
          <a href="mailto:dmitriy.tyutyunik@gmail.com">Contact</a>
        </div>
      </section>

      {activeDestination === 'home' && <CareerMetrics metrics={CAREER_METRICS} />}

      {activeDestination === 'workshop' && (
        <WorkshopDock projects={WORKSHOP_PROJECTS} activeProject={activeProject} onSelect={setActiveProject} />
      )}

      {activeDestination === 'cinema' && (
        <CareerReel acts={CAREER_ACTS} activeIndex={careerAct} onChange={setCareerAct} />
      )}

      {activeDestination === 'traveler' && (
        <ShowcasePanel title="Traveler Overlook" eyebrow="Experience becomes context" items={TRAVEL_HIGHLIGHTS} />
      )}
      {activeDestination === 'publisher' && <PublisherShelf books={PUBLISHED_BOOKS} />}

      <ProjectPanel
        project={activeDestination === 'workshop' ? WORKSHOP_PROJECTS.find((project) => project.id === activeProject) || null : null}
        onClose={() => setActiveProject(null)}
      />

      <DetailPanel
        destination={(activeProject || ['cinema', 'traveler', 'publisher'].includes(activeDestination)) ? null : activeData}
        onClose={() => navigate('home')}
      />

      <div className="social-links" aria-label="Professional links">
        <a href="https://github.com/dtyutyunik" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/dmitriy-tyutyunik" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
      <div className="world-hint" aria-hidden="true">Click a destination or use quick navigation</div>
    </main>
  );
}

export default App;
