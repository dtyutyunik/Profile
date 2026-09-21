import { Component, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import CameraRig from "./CameraRig";
import StaticWorld from "./StaticWorld";
import Destination from "./Destination";
import WorldGround from "./WorldGround";
import LivingWorld, { Water } from "./diorama/LivingWorld";
import { WORLD_DESTINATIONS } from "../data/worldData";

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
function RenderSchedule({ moving, onReady }) {
  const { invalidate, gl } = useThree();
  const frames = useRef(0);
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  useEffect(() => {
    let timer;
    const start = () => {
      clearInterval(timer);
      if (moving && !document.hidden)
        timer = setInterval(invalidate, 1000 / 30);
    };
    start();
    document.addEventListener("visibilitychange", start);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", start);
    };
  }, [moving, invalidate]);
  useFrame(() => {
    frames.current++;
    if (frames.current % 30 === 0) {
      gl.domElement.dataset.drawCalls = gl.info.render.calls;
      gl.domElement.dataset.triangles = gl.info.render.triangles;
      gl.domElement.dataset.frames = frames.current;
    }
  });
  return null;
}
export default function PortfolioWorld({
  activeDestination,
  onSelectDestination,
  paused = false,
  onReady,
}) {
  const [contextLost, setContextLost] = useState(false);
  const canvasRef = useRef();
  const handleContextLoss = useCallback((event) => {
    event.preventDefault();
    setContextLost(true);
  }, []);
  useEffect(
    () => () =>
      canvasRef.current?.removeEventListener(
        "webglcontextlost",
        handleContextLoss,
      ),
    [handleContextLoss],
  );
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(m.matches);
    m.addEventListener?.("change", sync);
    return () => m.removeEventListener?.("change", sync);
  }, []);
  const fallback = (
    <StaticWorld
      activeDestination={activeDestination}
      onSelectDestination={onSelectDestination}
      onReady={onReady}
    />
  );
  if (contextLost) return fallback;
  return (
    <SceneBoundary onError={onReady} fallback={fallback}>
      <Canvas
        className="world-canvas"
        shadows
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "default", alpha: false }}
        camera={{ position: [18, 18, 25], fov: 38, near: 0.1, far: 180 }}
        onCreated={({ gl }) => {
          canvasRef.current = gl.domElement;
          gl.domElement.addEventListener("webglcontextlost", handleContextLoss);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.16;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        fallback={fallback}
      >
        <color attach="background" args={["#ded6bb"]} />
        <fog attach="fog" args={["#ded6bb", 34, 85]} />
        <hemisphereLight args={["#ffe6bc", "#788f82", 1.3]} />
        <directionalLight
          position={[-8, 9, 5]}
          color="#ffd09a"
          intensity={3.0}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-14}
          shadow-camera-right={14}
          shadow-camera-top={13}
          shadow-camera-bottom={-13}
          shadow-camera-near={0.5}
          shadow-camera-far={45}
          shadow-normalBias={0.035}
          shadow-bias={-0.00015}
        />
        <directionalLight
          position={[5, 6, -8]}
          color="#c3d7d2"
          intensity={0.7}
        />
        <WorldGround />
        <Water motion={!paused && !reduced} />
        {WORLD_DESTINATIONS.map((d) => (
          <Destination
            key={d.id}
            destination={d}
            selected={activeDestination === d.id}
            overview={activeDestination === "home"}
            onSelect={onSelectDestination}
          />
        ))}
        <LivingWorld
          motion={!paused && !reduced}
          onNavigate={onSelectDestination}
        />
        <CameraRig
          activeDestination={activeDestination}
          reducedMotion={reduced}
        />
        <RenderSchedule moving={!paused && !reduced} onReady={onReady} />
      </Canvas>
    </SceneBoundary>
  );
}
