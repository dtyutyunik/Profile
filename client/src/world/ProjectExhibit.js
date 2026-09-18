import { Html } from '@react-three/drei';

const COLORS = {
  relive: '#d88b6c',
  agents: '#6cc4d7',
  support: '#8fc486',
  'travel-agent': '#d8b45d'
};

function ProjectExhibit({ project, position, onSelect }) {
  const color = COLORS[project.id] || '#d8b45d';
  return (
    <group position={position} onClick={(event) => { event.stopPropagation(); onSelect(project.id); }}>
      <mesh castShadow position={[0, .42, 0]}>
        <boxGeometry args={[1.15, .14, .72]} />
        <meshStandardMaterial color="#513825" />
      </mesh>
      <mesh castShadow position={[0, .75, -.1]}>
        <boxGeometry args={[.72, .48, .08]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={.22} />
      </mesh>
      <mesh castShadow position={[-.43, .16, -.22]}>
        <boxGeometry args={[.08, .52, .08]} />
        <meshStandardMaterial color="#49311f" />
      </mesh>
      <mesh castShadow position={[.43, .16, -.22]}>
        <boxGeometry args={[.08, .52, .08]} />
        <meshStandardMaterial color="#49311f" />
      </mesh>
      <Html center distanceFactor={9} position={[0, 1.25, 0]}>
        <button className="exhibit-label" type="button" onClick={(event) => { event.stopPropagation(); onSelect(project.id); }}>
          {project.title}
        </button>
      </Html>
    </group>
  );
}
export default ProjectExhibit;
