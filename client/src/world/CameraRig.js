import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { WORLD_DESTINATIONS } from "../data/worldData";

export default function CameraRig({ activeDestination, reducedMotion }) {
  const { camera, size, invalidate, scene } = useThree();
  const initialized = useRef(false);
  const target = useMemo(() => new THREE.Vector3(), []);
  const view = useMemo(() => {
    const mobile = size.width <= 760,
      aspect = size.width / size.height,
      home = activeDestination === "home";
    const d = WORLD_DESTINATIONS.find((d) => d.id === activeDestination);
    const look = new THREE.Vector3(...(d ? d.target : [0, 0.4, 0]));
    const direction = new THREE.Vector3(
      ...(d ? d.camera : [18, 18, 26]),
    ).normalize();
    const right = new THREE.Vector3(direction.z, 0, -direction.x).normalize();
    if (home && !mobile) look.addScaledVector(right, -3.5);
    if (!home && !mobile) look.addScaledVector(right, 2.1);
    if (home && mobile) look.y += 1.2;
    if (!home && mobile) look.y -= 1.4;
    const distance = home
      ? Math.max(mobile ? 30 : 31, (mobile ? 32 : 34) / aspect)
      : Math.max(mobile ? 13 : 14, (mobile ? 10.5 : 15) / aspect);
    return {
      position: look.clone().addScaledVector(direction, distance),
      target: look,
    };
  }, [activeDestination, size.width, size.height]);
  useFrame((_, delta) => {
    const snap = reducedMotion || !initialized.current;
    const damping = snap ? 1 : 1 - Math.exp(-3.8 * Math.min(delta, 0.1));
    camera.position.lerp(view.position, damping);
    target.lerp(view.target, damping);
    camera.lookAt(target);
    if (scene.fog) {
      scene.fog.near = Math.max(34, camera.position.distanceTo(target) + 3);
      scene.fog.far = scene.fog.near + 51;
    }
    if (
      camera.position.distanceToSquared(view.position) > 0.00001 ||
      target.distanceToSquared(view.target) > 0.00001
    )
      invalidate();
    initialized.current = true;
  });
  return null;
}
