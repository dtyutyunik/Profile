function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.13, 0.2, 1.1, 7]} />
        <meshStandardMaterial color="#65472f" />
      </mesh>
      <mesh castShadow position={[0, 1.25, 0]}>
        <coneGeometry args={[0.7, 1.55, 8]} />
        <meshStandardMaterial color="#365d49" />
      </mesh>
      <mesh castShadow position={[0, 1.85, 0]}>
        <coneGeometry args={[0.52, 1.25, 8]} />
        <meshStandardMaterial color="#426b53" />
      </mesh>
    </group>
  );
}

function Path({ position, rotation = 0, length = 5 }) {
  return (
    <mesh receiveShadow position={position} rotation={[-Math.PI / 2, 0, rotation]}>
      <planeGeometry args={[1.05, length]} />
      <meshStandardMaterial color="#cdbd94" roughness={1} />
    </mesh>
  );
}

function WorldGround() {
  const trees = [
    [-8.2, 0, 2.2, 1.1], [-7.5, 0, 4.6, .8], [-4.6, 0, 5.7, 1],
    [-2.8, 0, -5.7, .9], [2.5, 0, -5.8, 1.15], [4.5, 0, 3.1, .75],
    [7.9, 0, 1.9, 1.05], [7.4, 0, 5.3, .8], [-3.4, 0, 2.7, .7],
    [3.7, 0, -.5, .65], [-1.4, 0, 5.6, .7], [8.4, 0, -3.8, .85]
  ];

  return (
    <group>
      <mesh receiveShadow position={[0, -0.48, 0]}>
        <cylinderGeometry args={[12.6, 13.9, 0.95, 36]} />
        <meshStandardMaterial color="#6e8968" roughness={0.98} />
      </mesh>
      <mesh position={[0, -0.82, 0]}>
        <cylinderGeometry args={[13.2, 12.4, 0.65, 36]} />
        <meshStandardMaterial color="#6b5a47" roughness={1} />
      </mesh>

      <Path position={[-3.2, 0.025, -1.5]} rotation={-0.95} length={6.5} />
      <Path position={[3.15, 0.026, -1.5]} rotation={0.95} length={6.5} />
      <Path position={[1.3, 0.027, 2.8]} rotation={0.35} length={6.2} />

      <mesh receiveShadow position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.25, 36]} />
        <meshStandardMaterial color="#a79b79" roughness={1} />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.72, 36]} />
        <meshStandardMaterial color="#d8c89d" />
      </mesh>

      {trees.map(([x, y, z, scale], index) => (
        <Tree key={index} position={[x, y, z]} scale={scale} />
      ))}

      <group position={[-1.4, 0.05, 3.6]}>
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[1.6, 0.18, 0.85]} />
          <meshStandardMaterial color="#6c4932" />
        </mesh>
        {[-0.62, 0.62].map((x) => (
          <mesh key={x} castShadow position={[x, 0.23, 0]}>
            <boxGeometry args={[0.13, 0.55, 0.13]} />
            <meshStandardMaterial color="#523723" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default WorldGround;
