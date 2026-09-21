import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import "./Diorama.css";
import WorldHud from "./components/WorldHud";
import DetailPanel from "./components/DetailPanel";
import CareerMetrics from "./components/CareerMetrics";
import ProjectPanel from "./components/ProjectPanel";
import CareerReel from "./components/CareerReel";
import ShowcasePanel from "./components/ShowcasePanel";
import WorkshopDock from "./components/WorkshopDock";
import PublisherShelf from "./components/PublisherShelf";
import PortfolioWorld from "./world/PortfolioWorld";
import { CAREER_METRICS, WORLD_DESTINATIONS } from "./data/worldData";
import { WORKSHOP_PROJECTS } from "./data/workshopProjects";
import { CAREER_ACTS } from "./data/careerActs";
import { TRAVEL_HIGHLIGHTS } from "./data/travelHighlights";
import { PUBLISHED_BOOKS } from "./data/publishedBooks";

function App() {
  const [activeDestination, setActiveDestination] = useState("home");
  const [activeProject, setActiveProject] = useState(null);
  const [careerAct, setCareerAct] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const worldReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") {
        setActiveDestination("home");
        setActiveProject(null);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const navigate = (id) => {
    setActiveDestination(id);
    if (id !== "workshop") setActiveProject(null);
  };

  const openProject = (id) => {
    setActiveDestination("workshop");
    setActiveProject(id);
  };
  const openHighlight = (highlight) => {
    if (highlight.projectId) openProject(highlight.projectId);
    else {
      navigate("cinema");
      setCareerAct(highlight.act);
    }
  };

  const activeData = useMemo(
    () =>
      WORLD_DESTINATIONS.find((item) => item.id === activeDestination) || null,
    [activeDestination],
  );

  return (
    <main
      className={`portfolio-shell ${activeDestination === "home" ? "is-overview" : "is-destination"}`}
    >
      <PortfolioWorld
        paused={paused}
        onReady={worldReady}
        activeDestination={activeDestination}
        onSelectDestination={navigate}
        projects={WORKSHOP_PROJECTS}
        onSelectProject={setActiveProject}
      />

      <header className="site-masthead">
        <button
          onClick={() => navigate("home")}
          aria-label="Dmitriy Tyutyunik — overview"
        >
          <span className="brand-mark">dt.</span>
          <span>
            Dmitriy Tyutyunik<small>ENGINEER · EXPLORER · AUTHOR</small>
          </span>
        </button>
      </header>
      <WorldHud
        destinations={WORLD_DESTINATIONS}
        activeDestination={activeDestination}
        onNavigate={navigate}
      />

      <section
        className={`hero-copy ${activeDestination !== "home" ? "hero-copy--compact" : ""}`}
        aria-label="Introduction"
      >
        <p className="eyebrow">
          <span /> A SMALL WORLD. A LOT OF POSSIBILITY.
        </p>
        <h1>
          <span className="sr-only">Dmitriy Tyutyunik — </span>Built with
          <br />
          <em>curiosity.</em>
        </h1>
        <p>
          Senior frontend & AI product engineer.
          <br />{" "}I build interfaces, production AI, and tools that turn complex
          workflows into useful products.
        </p>
        <div className="hero-actions">
          <button type="button" onClick={() => openProject("support")}>
            Explore my AI work <span aria-hidden="true">↗</span>
          </button>
          <a href="mailto:dmitriy.tyutyunik@gmail.com">
            Let’s build something <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      {activeDestination === "home" && (
        <CareerMetrics metrics={CAREER_METRICS} onSelect={openHighlight} />
      )}

      {activeDestination === "workshop" && (
        <WorkshopDock
          projects={WORKSHOP_PROJECTS}
          activeProject={activeProject}
          onSelect={setActiveProject}
        />
      )}

      {activeDestination === "cinema" && (
        <CareerReel
          acts={CAREER_ACTS}
          activeIndex={careerAct}
          onChange={setCareerAct}
          onSelectProject={openProject}
        />
      )}

      {activeDestination === "traveler" && (
        <ShowcasePanel
          title="Traveler Overlook"
          eyebrow="Curiosity beyond the screen"
          items={TRAVEL_HIGHLIGHTS}
          onExplore={() => openProject("travel-agent")}
        />
      )}
      {activeDestination === "publisher" && (
        <PublisherShelf books={PUBLISHED_BOOKS} />
      )}

      <ProjectPanel
        project={
          activeDestination === "workshop"
            ? WORKSHOP_PROJECTS.find(
                (project) => project.id === activeProject,
              ) || null
            : null
        }
        onClose={() => setActiveProject(null)}
      />

      <DetailPanel
        destination={
          activeProject ||
          ["cinema", "traveler", "publisher"].includes(activeDestination)
            ? null
            : activeData
        }
        onClose={() => navigate("home")}
      />

      <div className="social-links" aria-label="Professional links">
        <a
          href="https://github.com/dtyutyunik"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/dmitriy-tyutyunik"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </div>
      <div className="world-controls">
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
          aria-label={
            paused ? "Resume world animation" : "Pause world animation"
          }
        >
          {paused ? "▷" : "Ⅱ"}
          <span>{paused ? "Play" : "Pause"}</span>
        </button>
        <span className="world-weather">
          <i /> Golden hour <span> · Somewhere between ideas</span>
        </span>
      </div>
      <div className="world-hint">
        {activeDestination === "home"
          ? "Four places. One ongoing story. Pick a destination."
          : "Explore another place using the navigation."}
      </div>
      {!ready && (
        <div className="world-loading" role="status">
          Building a little world<span>Good things are in the details.</span>
        </div>
      )}
    </main>
  );
}

export default App;
