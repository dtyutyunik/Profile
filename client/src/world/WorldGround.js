function WorldGround() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.35, 0]}>
        <cylinderGeometry args={[13, 14.5, 0.7, 32]} />
        <meshStandardMaterial color="#73906f" roughness={0.95} />
      </mesh>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[3.6, 4.05, 48]} />
        <meshStandardMaterial color="#d7c89d" roughness={1} />
      </mesh>

      {[
        [-3.3, 0.25, -1.6],
        [3.4, 0.25, -1.7],
        [1.4, 0.25, 3.6],
        [-4.8, 0.25, 3.8],
        [5.4, 0.25, 3.2]
      ].map(([x, y, z], index) => (
        <group key={index} position={[x, y, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.14, 0.22, 1.15, 8]} />
            <meshStandardMaterial color="#6a4c31" />
          </mesh>
          <mesh castShadow position={[0, 0.82, 0]}>
            <coneGeometry args={[0.62, 1.35, 8]} />
            <meshStandardMaterial color="#3f6652" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default WorldGround;
