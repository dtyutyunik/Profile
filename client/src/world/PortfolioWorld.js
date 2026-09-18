import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import CameraRig from './CameraRig';
import Destination from './Destination';
import WorldGround from './WorldGround';
import { WORLD_DESTINATIONS } from '../data/worldData';

function PortfolioWorld({ activeDestination, onSelectDestination }) {
  return (
    <Canvas
      className="world-canvas"
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [11, 10, 15], fov: 42, near: 0.1, far: 100 }}
      onPointerMissed={() => onSelectDestination('home')}
    >
      <color attach="background" args={['#18302b']} />
      <fog attach="fog" args={['#18302b', 20, 38]} />

      <hemisphereLight intensity={1.1} color="#f2dfb6" groundColor="#304b3d" />
      <directionalLight
        castShadow
        position={[8, 14, 8]}
        intensity={2.2}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <WorldGround />

      {WORLD_DESTINATIONS.map((destination) => (
        <Destination
          key={destination.id}
          destination={destination}
          selected={activeDestination === destination.id}
          onSelect={onSelectDestination}
        />
      ))}

      <ContactShadows
        position={[0, 0.03, 0]}
        opacity={0.28}
        scale={28}
        blur={2.5}
        far={8}
      />

      <Environment preset="sunset" />
      <CameraRig activeDestination={activeDestination} />
    </Canvas>
  );
}

export default PortfolioWorld;
