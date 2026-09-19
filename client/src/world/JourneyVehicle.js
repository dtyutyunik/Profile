import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { WORLD_DESTINATIONS } from '../data/worldData';

function JourneyVehicle({ activeDestination }) {
  const vehicle=useRef();
  const [reducedMotion,setReducedMotion]=useState(false);
  useEffect(()=>{ const media=window.matchMedia('(prefers-reduced-motion: reduce)'); const sync=()=>setReducedMotion(media.matches); sync(); media.addEventListener?.('change',sync); return()=>media.removeEventListener?.('change',sync); },[]);
  const target=useMemo(()=>{
    const destination=WORLD_DESTINATIONS.find((item)=>item.id===activeDestination);
    const p=destination ? destination.position : [0,0,0];
    return new THREE.Vector3(p[0],.48,p[2]+1.8);
  },[activeDestination]);

  useFrame((_,delta)=>{
    if(!vehicle.current) return;
    if(reducedMotion){ vehicle.current.position.copy(target); return; }
    const before=vehicle.current.position.clone();
    vehicle.current.position.lerp(target,1-Math.exp(-2.6*delta));
    const direction=target.clone().sub(before);
    if(direction.lengthSq()>.002) vehicle.current.rotation.y=Math.atan2(direction.x,direction.z);
  });

  return (
    <group ref={vehicle} position={[0,.48,1.8]} scale={.72}>
      <mesh castShadow position={[0,.22,0]}><boxGeometry args={[.72,.32,1.15]} /><meshStandardMaterial color="#d07d58" /></mesh>
      <mesh castShadow position={[0,.48,-.12]}><boxGeometry args={[.58,.28,.48]} /><meshStandardMaterial color="#e6dfcf" /></mesh>
      {[-.38,.38].flatMap(x=>[-.38,.38].map(z=><mesh key={x+'-'+z} position={[x,.08,z]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.16,.16,.12,12]} /><meshStandardMaterial color="#202825" /></mesh>))}
      <mesh position={[0,.52,-.38]}><boxGeometry args={[.38,.12,.03]} /><meshBasicMaterial color="#17252a" /></mesh>
    </group>
  );
}
export default JourneyVehicle;
