import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { WORLD_DESTINATIONS } from "../data/worldData";

// Genuine renders of the same authored scene, for unavailable/lost WebGL contexts.
// Navigation and every piece of portfolio content remain fully interactive.
export default function StaticWorld({
  activeDestination,
  onSelectDestination,
  onReady,
}) {
  const holder = useRef();
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    onReady?.();
    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    );
    observer.observe(holder.current);
    return () => observer.disconnect();
  }, [onReady]);
  const mobile = size.width <= 760,
    home = activeDestination === "home";
  const pins = useMemo(() => {
    const w = mobile ? 780 : 1440,
      h = mobile ? 1688 : 1000,
      aspect = w / h;
    const d = WORLD_DESTINATIONS.find((d) => d.id === activeDestination);
    const look = new THREE.Vector3(...(d ? d.target : [0, 0.4, 0])),
      direction = new THREE.Vector3(
        ...(d ? d.camera : [18, 18, 26]),
      ).normalize(),
      right = new THREE.Vector3(direction.z, 0, -direction.x).normalize();
    if (home && !mobile) look.addScaledVector(right, -3.5);
    if (!home && !mobile) look.addScaledVector(right, 2.1);
    if (home && mobile) look.y += 1.2;
    if (!home && mobile) look.y -= 1.4;
    const distance = home
      ? Math.max(mobile ? 30 : 31, (mobile ? 32 : 34) / aspect)
      : Math.max(mobile ? 13 : 14, (mobile ? 10.5 : 15) / aspect);
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 180);
    camera.position.copy(look).addScaledVector(direction, distance);
    camera.lookAt(look);
    camera.updateMatrixWorld();
    const scale = Math.max(size.width / w, size.height / h),
      ox = (size.width - w * scale) / 2,
      oy = (size.height - h * scale) / 2;
    return WORLD_DESTINATIONS.filter(
      (item) => home || item.id === activeDestination,
    ).map((item) => {
      const p = new THREE.Vector3(...item.position);
      p.y += item.id === "cinema" ? 4.1 : 3.8;
      p.project(camera);
      return {
        ...item,
        x: ox + (p.x * 0.5 + 0.5) * w * scale,
        y: oy + (-p.y * 0.5 + 0.5) * h * scale,
      };
    });
  }, [activeDestination, home, mobile, size.width, size.height]);
  return (
    <div
      ref={holder}
      className="static-world"
      aria-label="Miniature island portfolio"
    >
      <img
        src={`/world-stills/${activeDestination}${mobile ? "-mobile" : ""}.webp`}
        alt="A miniature island with a cinema, workshop, bookshop, observatory, bridges, trees, and a waterfall in warm evening light."
        fetchPriority="high"
      />
      {pins.map((d) => (
        <button
          key={d.id}
          className={`destination-pin static-pin ${home ? "" : "destination-pin--active"}`}
          style={{ left: d.x, top: d.y }}
          onClick={() => onSelectDestination(d.id)}
          aria-label={`Explore ${d.title}`}
        >
          <span>0{WORLD_DESTINATIONS.findIndex((v) => v.id === d.id) + 1}</span>
          <b>{d.navLabel}</b>
          <i>↗</i>
        </button>
      ))}
      <span className="static-world-note">
        Still-world view · Explore every destination
      </span>
    </div>
  );
}
