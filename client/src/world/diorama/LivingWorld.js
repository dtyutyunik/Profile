import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Builder, C } from "./geometry";
import { riverX } from "./landscape";

function robot(color) {
  const b = new Builder();
  b.ball([0, 0.36, 0], [0.14, 0.18, 0.12], C.cream);
  b.box([0, 0.59, 0], [0.31, 0.23, 0.24], C.cream);
  b.box([0, 0.6, 0.126], [0.25, 0.115, 0.025], C.dark);
  for (let x of [-0.065, 0.065]) {
    b.box(
      [x, 0.601, 0.143],
      [0.035, 0.035, 0.015],
      "#8ee0d2",
      [0, 0, 0],
      "glow",
    );
    b.cyl([x, 0.12, 0], 0.041, 0.05, 0.2, C.dark, 8);
    b.box([x, 0.035, 0.035], [0.085, 0.07, 0.14], C.dark);
  }
  for (let side of [-1, 1])
    b.line([side * 0.16, 0.45, 0], [side * 0.23, 0.26, 0.06], 0.035, C.gold);
  b.box([0, 0.36, 0.125], [0.12, 0.055, 0.02], color);
  b.line([0, 0.71, 0], [0, 0.81, 0], 0.012, C.gold);
  b.ball([0, 0.82, 0], [0.027, 0.027, 0.027], color);
  return b.finish("Little agent");
}
function boat() {
  const b = new Builder();
  // Curved, pointed hull built from cross sections.
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.9);
  shape.bezierCurveTo(0.62, -0.6, 0.65, 0.6, 0, 0.94);
  shape.bezierCurveTo(-0.65, 0.6, -0.62, -0.6, 0, -0.9);
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 0.25,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 2,
    steps: 1,
  });
  b.add(g, "#9b5c3c", [0, 0, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
  g.dispose();
  for (let z of [-0.4, 0, 0.4])
    b.box([0, 0.03, z], [0.74, 0.06, 0.16], C.cream);
  b.line([-0.7, 0.05, -0.5], [0.4, 0.13, 0.6], 0.035, C.wood);
  b.box([-0.65, 0.05, -0.46], [0.18, 0.03, 0.36], C.wood, [0, -0.65, 0]);
  return b.finish("Harbor rowboat");
}
function balloon() {
  const b = new Builder();
  const g = new THREE.SphereGeometry(1, 32, 20);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    const f = y < 0 ? 0.65 + 0.35 * (y + 1) : 1;
    p.setXYZ(i, p.getX(i) * f, p.getY(i) * 1.2, p.getZ(i) * f);
  }
  g.computeVertexNormals();
  // Sewn fabric gores, alternating saffron and cream.
  const non = g.toNonIndexed(),
    v = non.attributes.position,
    colors = [];
  for (let i = 0; i < v.count; i += 3) {
    let mx = 0,
      mz = 0;
    for (let j = 0; j < 3; j++) {
      mx += v.getX(i + j);
      mz += v.getZ(i + j);
    }
    const a = Math.atan2(mz, mx),
      c = new THREE.Color(
        Math.floor(((a + Math.PI + 0.00001) / Math.PI) * 8) % 2
          ? "#d2965f"
          : "#e7d2a8",
      );
    for (let j = 0; j < 3; j++) colors.push(c.r, c.g, c.b);
  }
  non.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const mesh = new THREE.Mesh(
    non,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
  );
  mesh.position.y = 1.9;
  b.extras.push(mesh);
  g.dispose();
  b.box([0, 0.12, 0], [0.44, 0.32, 0.44], C.wood);
  for (let x of [-0.19, 0.19])
    for (let z of [-0.19, 0.19])
      b.line([x, 0.26, z], [x * 1.4, 1.12, z * 1.4], 0.015, C.dark);
  for (let y of [0, 0.08, 0.16, 0.24])
    b.box([0, y, 0.23], [0.45, 0.017, 0.025], C.gold);
  return b.finish("Explorer balloon");
}
export function pickup() {
  const b = new Builder();
  b.extrude(
    [
      [-0.4, 0.22],
      [-0.42, 0.5],
      [-0.33, 0.63],
      [0.34, 0.63],
      [0.43, 0.48],
      [0.4, 0.22],
    ],
    1.6,
    [0, 0, -0.8],
    "#aa6745",
    [0, 0, 0],
    0.05,
  );
  b.box([0, 0.57, -0.41], [0.66, 0.05, 0.55], C.dark);
  for (let x of [-0.34, 0.34])
    b.box([x, 0.7, 0.18], [0.045, 0.48, 0.65], C.cream);
  b.box([0, 0.95, 0.18], [0.73, 0.08, 0.7], C.cream);
  b.box([0, 0.76, 0.52], [0.62, 0.28, 0.03], C.glass, [-0.15, 0, 0]);
  b.box([0, 0.75, -0.17], [0.62, 0.28, 0.03], C.glass);
  for (let x of [-0.44, 0.44])
    for (let z of [-0.51, 0.51]) {
      b.cyl([x, 0.23, z], 0.21, 0.21, 0.14, C.dark, 16, [0, 0, Math.PI / 2]);
      b.cyl([x * 1.17, 0.23, z], 0.11, 0.11, 0.014, C.gold, 12, [
        0,
        0,
        Math.PI / 2,
      ]);
    }
  b.box([0, 0.34, 0.86], [0.85, 0.08, 0.11], C.cream);
  b.box([0, 0.49, 0.838], [0.3, 0.12, 0.03], C.dark);
  for (let x of [-0.28, 0.28])
    b.box([x, 0.51, 0.838], [0.15, 0.12, 0.035], C.light, [0, 0, 0], "glow");
  for (let x of [-0.3, 0.3])
    b.line([x, 1.02, -0.17], [x, 1.02, 0.5], 0.025, C.dark);
  b.box([0, 1.1, 0.12], [0.41, 0.15, 0.44], C.wood);
  return b.finish("Workshop pickup");
}
export default function LivingWorld({ motion, onNavigate }) {
  const robots = useMemo(
    () => ["#e7b465", "#6faaa0", "#d08366", "#95bbb0", "#d29875"].map(robot),
    [],
  );
  const rowboat = useMemo(boat, []),
    airship = useMemo(balloon, []),
    truck = useMemo(pickup, []);
  const walker = useRef(),
    greeter = useRef(),
    reader = useRef(),
    floating = useRef(),
    air = useRef(),
    t = useRef(0);
  useFrame((_, delta) => {
    if (!motion) return;
    t.current += Math.min(delta, 0.06);
    const time = t.current;
    if (walker.current) {
      walker.current.position.x = -3.5 + Math.sin(time * 0.24) * 0.62;
      walker.current.position.z = 1.7 + Math.sin(time * 0.24) * 0.23;
      walker.current.position.y = 0.045 + Math.abs(Math.sin(time * 4)) * 0.025;
      walker.current.rotation.y = Math.cos(time * 0.24) > 0 ? 1.2 : -1.9;
    }
    if (greeter.current) {
      greeter.current.rotation.y = 0.2 + Math.sin(time * 0.9) * 0.7;
      greeter.current.rotation.z = Math.sin(time * 1.8) * 0.07;
    }
    if (reader.current) {
      reader.current.position.x = 4.05 + Math.sin(time * 0.45) * 0.65;
      reader.current.position.y = 0.1 + Math.abs(Math.sin(time * 4)) * 0.035;
      reader.current.rotation.y = Math.cos(time * 0.45) > 0 ? 1.57 : -1.57;
    }
    if (floating.current) {
      floating.current.position.x = -3.3 + Math.sin(time * 0.24) * 0.65;
      floating.current.position.z = 8.4 + Math.sin(time * 0.3) * 0.25;
      floating.current.position.y = -2.07 + Math.sin(time * 1.5) * 0.09;
      floating.current.rotation.y = 0.55 + Math.sin(time * 0.4) * 0.18;
      floating.current.rotation.z = Math.sin(time * 1.1) * 0.065;
    }
    if (air.current) {
      air.current.position.x = 5.8 + Math.sin(time * 0.3) * 1.25;
      air.current.position.z = -6.9 + Math.sin(time * 0.22) * 0.5;
      air.current.position.y = 4.5 + Math.sin(time * 0.65) * 0.48;
      air.current.rotation.z = Math.sin(time * 0.5) * 0.06;
      air.current.rotation.y = Math.sin(time * 0.3) * 0.2;
    }
  });
  return (
    <group>
      <group position={[-5.5, 0.05, 2.1]} rotation={[0, -0.45, 0]}>
        <primitive object={truck} />
      </group>
      <group
        ref={walker}
        position={[-3.5, 0.045, 1.7]}
        onClick={(event) => {
          event.stopPropagation();
          onNavigate?.("workshop");
        }}
      >
        <primitive object={robots[0]} />
      </group>
      <group position={[-0.05, 0.1, 1.7]} rotation={[0, -0.4, 0]}>
        <primitive object={robots[1]} />
      </group>
      <group
        ref={greeter}
        position={[-5.55, 0.15, -0.37]}
        rotation={[0, 0.2, 0]}
      >
        <primitive object={robots[2]} />
      </group>
      <group position={[4.6, 0.54, -1.2]} rotation={[0, -0.4, 0]}>
        <primitive object={robots[3]} />
      </group>
      <group ref={reader} position={[4.05, 0.1, 5.55]} rotation={[0, 0.4, 0]}>
        <primitive object={robots[4]} />
      </group>
      <group
        ref={floating}
        position={[-3.3, -2.07, 8.2]}
        rotation={[0, 0.55, 0]}
      >
        <primitive object={rowboat} />
      </group>
      <group
        ref={air}
        position={[5.8, 4.5, -6.9]}
        scale={0.85}
        onClick={(event) => {
          event.stopPropagation();
          onNavigate?.("traveler");
        }}
      >
        <primitive object={airship} />
      </group>
    </group>
  );
}

const waterVertex = `varying vec3 vWorld; void main(){vec4 p=modelMatrix*vec4(position,1.);vWorld=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}`;
const waterFragment = `uniform float time;uniform vec3 deepColor;uniform vec3 shallowColor;uniform float river;varying vec3 vWorld;
void main(){
  float w=sin(vWorld.x*3.+vWorld.z*4.-time*1.6)*sin(vWorld.z*5.-time*1.1);
  float flow=pow(max(0.,sin(vWorld.z*9.-time*5.+sin(vWorld.x*7.))),12.);
  float shimmer=pow(max(0.,sin(vWorld.x*6.+vWorld.z*2.-time*1.5)),18.);
  vec3 c=mix(deepColor,shallowColor,.48+w*.18+shimmer*.2);
  c=mix(c,vec3(.75,.87,.79),flow*river*.38);
  float distanceFog=smoothstep(14.,60.,length(vWorld.xz));
  c=mix(c,vec3(.78,.76,.67),distanceFog*(1.-river));
  gl_FragColor=vec4(c,1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
const fallVertex = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fallFragment = `uniform float time;varying vec2 vUv;
void main(){
  float strands=sin(vUv.x*85.+sin(vUv.y*8.+time*3.));
  float drops=pow(max(0.,sin(vUv.y*32.+time*11.+sin(vUv.x*53.)*2.)),5.);
  vec3 c=mix(vec3(.40,.68,.65),vec3(.88,.96,.85),drops*.75+strands*.12+.2);
  gl_FragColor=vec4(c,.78+drops*.2);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
export function Water({ motion }) {
  const sea = useRef(),
    stream = useRef(),
    fall = useRef(),
    ripples = useRef(),
    clock = useRef(0);
  const riverGeo = useMemo(() => {
    const vs = [];
    for (let i = 0; i < 160; i++) {
      const z = -7.62 + i * 0.095,
        z2 = z + 0.095,
        x = riverX(z),
        x2 = riverX(z2),
        w = 0.56;
      vs.push(
        x - w,
        -0.23,
        z,
        x2 - w,
        -0.23,
        z2,
        x + w,
        -0.23,
        z,
        x + w,
        -0.23,
        z,
        x2 - w,
        -0.23,
        z2,
        x2 + w,
        -0.23,
        z2,
      );
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(vs, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      deepColor: { value: new THREE.Color("#568c87") },
      shallowColor: { value: new THREE.Color("#91b9a6") },
      river: { value: 0 },
    }),
    [],
  );
  const riverUniforms = useMemo(
    () => ({
      ...uniforms,
      river: { value: 1 },
      deepColor: { value: new THREE.Color("#4d948e") },
      shallowColor: { value: new THREE.Color("#8cbdae") },
    }),
    [uniforms],
  );
  useFrame((_, delta) => {
    if (motion) {
      clock.current += Math.min(delta, 0.06);
      uniforms.time.value = clock.current;
    }
    if (ripples.current)
      ripples.current.children.forEach((ripple, i) => {
        const phase = (clock.current * 0.65 + i / 3) % 1;
        ripple.scale.setScalar(0.4 + phase * 1.35);
        ripple.material.opacity = (1 - phase) * 0.65;
      });
  });
  return (
    <group>
      <mesh ref={sea} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.57, 0]}>
        <planeGeometry args={[240, 240]} />
        <shaderMaterial
          vertexShader={waterVertex}
          fragmentShader={waterFragment}
          uniforms={uniforms}
        />
      </mesh>
      <mesh ref={stream} geometry={riverGeo}>
        <shaderMaterial
          vertexShader={waterVertex}
          fragmentShader={waterFragment}
          uniforms={riverUniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group position={[riverX(7.55), -1.39, 7.57]}>
        <mesh ref={fall} rotation={[-0.09, 0, 0]}>
          <planeGeometry args={[1.1, 2.5, 8, 16]} />
          <shaderMaterial
            vertexShader={fallVertex}
            fragmentShader={fallFragment}
            uniforms={uniforms}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <group ref={ripples}>
          {[0.3, 0.55, 0.85].map((r, i) => (
            <mesh
              key={r}
              position={[0, -1.1, 0.12 + i * 0.19]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[r, r + 0.035, 40]} />
              <meshBasicMaterial
                color="#d8e3c7"
                transparent
                opacity={0.45 - i * 0.1}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
