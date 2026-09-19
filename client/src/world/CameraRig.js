import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { OVERVIEW_CAMERA, WORLD_DESTINATIONS } from '../data/worldData';

function CameraRig({ activeDestination }) {
  const { camera } = useThree();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const phone = window.matchMedia('(max-width: 760px)');
    const sync = () => { setReducedMotion(motion.matches); setMobile(phone.matches); };
    sync();
    motion.addEventListener?.('change', sync);
    phone.addEventListener?.('change', sync);
    return () => { motion.removeEventListener?.('change', sync); phone.removeEventListener?.('change', sync); };
  }, []);

  const view = useMemo(() => WORLD_DESTINATIONS.find((d) => d.id === activeDestination) || OVERVIEW_CAMERA, [activeDestination]);
  const desiredPosition = useMemo(() => {
    const position = new THREE.Vector3(...view.camera);
    if (mobile) {
      position.multiplyScalar(activeDestination === 'home' ? 1.22 : 1.12);
      position.y += activeDestination === 'home' ? 2.2 : 1;
    }
    return position;
  }, [view, mobile, activeDestination]);
  const desiredTarget = useMemo(() => new THREE.Vector3(...view.target), [view]);
  const currentTarget = useMemo(() => new THREE.Vector3(...OVERVIEW_CAMERA.target), []);

  useFrame((state, delta) => {
    const damping = reducedMotion ? 1 : 1 - Math.exp(-3.25 * delta);
    camera.position.lerp(desiredPosition, damping);
    currentTarget.lerp(desiredTarget, damping);
    camera.lookAt(currentTarget);
    if (!reducedMotion && activeDestination === 'home' && !mobile) {
      camera.position.x += state.pointer.x * 0.006;
      camera.position.y += state.pointer.y * 0.003;
    }
  });
  return null;
}
export default CameraRig;
