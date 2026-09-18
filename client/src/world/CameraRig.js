import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { OVERVIEW_CAMERA, WORLD_DESTINATIONS } from '../data/worldData';

function CameraRig({ activeDestination }) {
  const { camera } = useThree();

  const view = useMemo(() => {
    return (
      WORLD_DESTINATIONS.find((destination) => destination.id === activeDestination) ||
      OVERVIEW_CAMERA
    );
  }, [activeDestination]);

  const desiredPosition = useMemo(
    () => new THREE.Vector3(...view.camera),
    [view]
  );
  const desiredTarget = useMemo(
    () => new THREE.Vector3(...view.target),
    [view]
  );
  const currentTarget = useMemo(() => new THREE.Vector3(...OVERVIEW_CAMERA.target), []);

  useFrame((state, delta) => {
    const damping = 1 - Math.exp(-3.25 * delta);
    camera.position.lerp(desiredPosition, damping);
    currentTarget.lerp(desiredTarget, damping);
    camera.lookAt(currentTarget);

    if (activeDestination === 'home') {
      camera.position.x += state.pointer.x * 0.006;
      camera.position.y += state.pointer.y * 0.003;
    }
  });

  return null;
}

export default CameraRig;
