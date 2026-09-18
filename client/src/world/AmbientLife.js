import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function Robot({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.48, 0]}>
        <capsuleGeometry args={[0.22, 0.35, 6, 10]} />
        <meshStandardMaterial color="#e8e5dc" roughness={0.55} />
      </mesh>
      <mesh castShadow position={[0, 0.93, 0]}>
        <boxGeometry args={[0.48, 0.34, 0.38]} />
        <meshStandardMaterial color="#ece9df" />
      </mesh>
      <mesh position={[0, 0.94, 0.2]}>
        <boxGeometry args={[0.31, 0.14, 0.025]} />
        <meshStandardMaterial color="#17252a" emissive="#17333b" emissiveIntensity={0.8} />
      </mesh>
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, 0.95, 0.22]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#79d9ff" />
        </mesh>
      ))}
    </group>
  );
}

function AmbientLife() {
  const plane = useRef();
  const beacon = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (plane.current) {
      plane.current.position.x = Math.sin(t * 0.16) * 11;
      plane.current.position.z = Math.cos(t * 0.16) * 8;
      plane.current.position.y = 6.5 + Math.sin(t * 0.35) * 0.35;
      plane.current.rotation.y = -t * 0.16 + Math.PI / 2;
    }
    if (beacon.current) {
      beacon.current.rotation.y = t * 0.45;
    }
  });

  return (
    <group>
      <Robot position={[-5.3, 0, -1.5]} scale={0.75} />
      <Robot position={[1.3, 0, 1.3]} scale={0.72} />
      <Robot position={[5.2, 0, -1.5]} scale={0.7} />
      <Robot position={[3.2, 0, 6.4]} scale={0.72} />

      <group ref={plane} position={[0, 7, 8]} scale={0.65}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.22, 0.35]} />
          <meshStandardMaterial color="#e9e4d7" />
        </mesh>
        <mesh position={[-0.1, 0, 0]}>
          <boxGeometry args={[0.55, 0.06, 2.1]} />
          <meshStandardMaterial color="#c26d4c" />
        </mesh>
        <mesh position={[-0.72, 0.15, 0]}>
          <boxGeometry args={[0.5, 0.65, 0.08]} />
          <meshStandardMaterial color="#c26d4c" />
        </mesh>
      </group>

      <group ref={beacon} position={[6, 3.5, -3]}>
        <mesh>
          <torusGeometry args={[1.9, 0.025, 8, 48]} />
          <meshBasicMaterial color="#e4cc8f" transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

export default AmbientLife;
