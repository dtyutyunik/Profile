import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import CameraRig from './CameraRig';
import Destination from './Destination';
import WorldGround from './WorldGround';
import AmbientLife from './AmbientLife';
import ProjectExhibit from './ProjectExhibit';
import JourneyVehicle from './JourneyVehicle';
import { WORLD_DESTINATIONS } from '../data/worldData';

function PortfolioWorld({ activeDestination, onSelectDestination, projects = [], onSelectProject }) {
  return (
    <Canvas
      className="world-canvas"
      fallback={<div className="world-fallback" aria-hidden="true" />}
      shadows
      dpr={[1, 1.25]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [11, 10, 15], fov: 42, near: 0.1, far: 100 }}
      onPointerMissed={() => onSelectDestination('home')}
    >
      <color attach="background" args={['#18302b']} />
      <fog attach="fog" args={['#18302b', 20, 38]} />

      <hemisphereLight intensity={1.05} color="#f2dfb6" groundColor="#304b3d" />
      <directionalLight castShadow position={[8, 14, 8]} intensity={2.1}
        shadow-mapSize-width={768} shadow-mapSize-height={768} />

      <WorldGround />
      {WORLD_DESTINATIONS.map((destination) => (
        <Destination key={destination.id} destination={destination}
          selected={activeDestination === destination.id}
          onSelect={onSelectDestination} />
      ))}
      {projects.map((project, index) => (
        <ProjectExhibit
          key={project.id}
          project={project}
          position={[-1.65 + (index % 2) * 3.3, 0, -0.85 + Math.floor(index / 2) * 1.65]}
          onSelect={onSelectProject}
        />
      ))}
      <AmbientLife />
      <JourneyVehicle activeDestination={activeDestination} />
      <ContactShadows position={[0, 0.03, 0]} opacity={0.25} scale={28} blur={2.5} far={8} />
      <Environment preset="sunset" />
      <CameraRig activeDestination={activeDestination} />
    </Canvas>
  );
}

export default PortfolioWorld;
