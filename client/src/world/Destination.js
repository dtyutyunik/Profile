import { Html } from '@react-three/drei';

function Label({ children }) {
  return (
    <Html center distanceFactor={11} position={[0, 2.9, 0]}>
      <div
        style={{
          padding: '6px 10px',
          borderRadius: 999,
          background: 'rgba(13, 22, 19, .82)',
          border: '1px solid rgba(255,255,255,.14)',
          color: '#f7f4eb',
          whiteSpace: 'nowrap',
          fontSize: 12,
          pointerEvents: 'none'
        }}
      >
        {children}
      </div>
    </Html>
  );
}

function Workshop({ selected, onSelect }) {
  return (
    <group onClick={onSelect}>
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[4.2, 1.1, 3.2]} />
        <meshStandardMaterial color={selected ? '#d8a84f' : '#8b5f3c'} />
      </mesh>
      <mesh castShadow position={[0, 1.7, -0.7]}>
        <boxGeometry args={[2.7, 1.6, 1.4]} />
        <meshStandardMaterial color="#d3b17b" />
      </mesh>
      <mesh castShadow position={[0, 2.45, -0.7]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[2.05, 2.05, 0.45]} />
        <meshStandardMaterial color="#6d3f2a" />
      </mesh>
      <mesh castShadow position={[-1.1, 1.55, 1.3]}>
        <cylinderGeometry args={[0.18, 0.24, 1.2, 12]} />
        <meshStandardMaterial color="#b8c6bd" metalness={0.4} />
      </mesh>
      <mesh castShadow position={[1.15, 1.45, 1.3]}>
        <boxGeometry args={[0.8, 0.7, 0.8]} />
        <meshStandardMaterial color="#5c7c72" />
      </mesh>
      <Label>Workshop</Label>
    </group>
  );
}

function Cinema({ selected, onSelect }) {
  return (
    <group onClick={onSelect}>
      <mesh castShadow receiveShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[4.1, 1.5, 3]} />
        <meshStandardMaterial color={selected ? '#b44f45' : '#6f3e3f'} />
      </mesh>
      <mesh castShadow position={[0, 1.8, -1.25]}>
        <boxGeometry args={[3.4, 1.3, 0.35]} />
        <meshStandardMaterial color="#e9d7a6" />
      </mesh>
      {[-1.1, 0, 1.1].map((x) => (
        <mesh key={x} castShadow position={[x, 1, 0.45]}>
          <boxGeometry args={[0.6, 0.5, 0.6]} />
          <meshStandardMaterial color="#c35f4d" />
        </mesh>
      ))}
      <Label>Career Cinema</Label>
    </group>
  );
}

function Traveler({ selected, onSelect }) {
  return (
    <group onClick={onSelect}>
      <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
        <cylinderGeometry args={[2.2, 2.6, 0.9, 18]} />
        <meshStandardMaterial color={selected ? '#588f82' : '#456d65'} />
      </mesh>
      <mesh castShadow position={[0, 1.85, 0]}>
        <sphereGeometry args={[1.25, 24, 16]} />
        <meshStandardMaterial color="#6da7a0" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 1.85, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[1.45, 0.07, 10, 48]} />
        <meshStandardMaterial color="#d4c08a" metalness={0.35} />
      </mesh>
      <Label>Traveler Overlook</Label>
    </group>
  );
}

function Publisher({ selected, onSelect }) {
  return (
    <group onClick={onSelect}>
      <mesh castShadow receiveShadow position={[0, 0.65, 0]}>
        <boxGeometry args={[3.4, 1.3, 2.8]} />
        <meshStandardMaterial color={selected ? '#7b5a9b' : '#574667'} />
      </mesh>
      <mesh castShadow position={[0, 1.65, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[2.35, 2.35, 0.5]} />
        <meshStandardMaterial color="#4b2d3c" />
      </mesh>
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, index) => (
        <mesh key={x} castShadow position={[x, 1.15, 1.43]}>
          <boxGeometry args={[0.22, 0.7 + index * 0.04, 0.12]} />
          <meshStandardMaterial
            color={['#d6a75f', '#9b6573', '#5c8b88', '#b9a4d5', '#d07d58'][index]}
          />
        </mesh>
      ))}
      <Label>Publisher House</Label>
    </group>
  );
}

function Destination({ destination, selected, onSelect }) {
  const common = {
    selected,
    onSelect: (event) => {
      event.stopPropagation();
      onSelect(destination.id);
    }
  };

  let Content = Workshop;
  if (destination.id === 'cinema') Content = Cinema;
  if (destination.id === 'traveler') Content = Traveler;
  if (destination.id === 'publisher') Content = Publisher;

  return (
    <group position={destination.position}>
      <Content {...common} />
    </group>
  );
}

export default Destination;
