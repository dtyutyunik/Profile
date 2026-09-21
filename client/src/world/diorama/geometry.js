import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

// Every static detail is baked into a handful of vertex-colored material batches.
// Geometry stays original and editable; no remote model, font, or HDR dependency.
const BASIC = {
  box: new THREE.BoxGeometry(1, 1, 1),
  leaf: new THREE.IcosahedronGeometry(1, 1),
  rock: new THREE.IcosahedronGeometry(1, 0),
  ball: new THREE.SphereGeometry(1, 12, 8),
  cylinder: new THREE.CylinderGeometry(1, 1, 1, 10),
};
export const C = {
  cream: "#ead5ae",
  plaster: "#dcbf95",
  trim: "#fff0cd",
  terracotta: "#a65337",
  roof: "#375e60",
  teal: "#437b73",
  dark: "#283a38",
  wood: "#815537",
  gold: "#cfac62",
  glass: "#4e9090",
  light: "#ffce79",
  stone: "#999279",
  brick: "#af6b4b",
};
export function rng(seed = 127) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
export class Builder {
  constructor() {
    this.parts = { matte: [], metal: [], glow: [] };
    this.extras = [];
  }
  add(
    geometry,
    color,
    position = [0, 0, 0],
    scale = [1, 1, 1],
    rotation = [0, 0, 0],
    type = "matte",
  ) {
    let g = geometry.clone();
    if (g.index) {
      const old = g;
      g = g.toNonIndexed();
      old.dispose();
    }
    g.deleteAttribute("uv");
    const matrix = new THREE.Matrix4().compose(
      new THREE.Vector3(...position),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
      new THREE.Vector3(...scale),
    );
    g.applyMatrix4(matrix);
    const c = new THREE.Color(color),
      colors = new Float32Array(g.attributes.position.count * 3);
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = c.r;
      colors[i + 1] = c.g;
      colors[i + 2] = c.b;
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.parts[type].push(g);
  }
  box(p, s, c = C.cream, r = [0, 0, 0], type = "matte") {
    this.add(BASIC.box, c, p, s, r, type);
  }
  ball(p, s, c = C.cream, faceted = false) {
    this.add(faceted ? BASIC.leaf : BASIC.ball, c, p, s);
  }
  rock(p, s, c) {
    this.add(BASIC.rock, c, p, s, [p[2], p[0], p[1]]);
  }
  cyl(p, rt, rb, h, c = C.wood, n = 12, r = [0, 0, 0], type = "matte") {
    const g = new THREE.CylinderGeometry(rt, rb, h, n);
    this.add(g, c, p, [1, 1, 1], r, type);
    g.dispose();
  }
  line(a, b, r, c = C.wood, type = "matte") {
    const start = new THREE.Vector3(...a),
      end = new THREE.Vector3(...b),
      d = end.clone().sub(start);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      d.clone().normalize(),
    );
    const e = new THREE.Euler().setFromQuaternion(q);
    this.add(
      BASIC.cylinder,
      c,
      start.add(end).multiplyScalar(0.5).toArray(),
      [r, d.length(), r],
      e.toArray().slice(0, 3),
      type,
    );
  }
  torus(p, r, t, c = C.gold, rotation = [0, 0, 0], arc = Math.PI * 2) {
    const g = new THREE.TorusGeometry(r, t, 6, 40, arc);
    this.add(g, c, p, [1, 1, 1], rotation, "metal");
    g.dispose();
  }
  extrude(points, depth, p, c, rotation = [0, 0, 0], bevel = 0.025) {
    const shape = new THREE.Shape(points.map((v) => new THREE.Vector2(...v)));
    const g = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: bevel > 0,
      bevelSize: bevel,
      bevelThickness: bevel,
      bevelSegments: 1,
      steps: 1,
    });
    this.add(g, c, p, [1, 1, 1], rotation);
    g.dispose();
  }
  sign(
    text,
    p,
    w,
    h,
    bg = C.dark,
    fg = C.light,
    rotation = [0, 0, 0],
    small = "",
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 192;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 192);
    ctx.strokeStyle = fg;
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, 488, 168);
    ctx.fillStyle = fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${text.length > 12 ? 37 : 51}px Georgia`;
    ctx.fillText(text, 256, small ? 77 : 100, 463);
    if (small) {
      ctx.font = "20px sans-serif";
      ctx.fillText(small, 256, 133, 455);
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map, toneMapped: false }),
    );
    mesh.position.set(...p);
    mesh.rotation.set(...rotation);
    this.extras.push(mesh);
  }
  finish(name) {
    const group = new THREE.Group();
    group.name = name;
    Object.entries(this.parts).forEach(([type, parts]) => {
      if (!parts.length) return;
      const geometry = mergeGeometries(parts);
      parts.forEach((g) => g.dispose());
      geometry.computeBoundingSphere();
      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: type === "metal" ? 0.38 : 0.86,
        metalness: type === "metal" ? 0.55 : 0,
        ...(type === "glow"
          ? { emissive: "#ffffff", emissiveIntensity: 0.7 }
          : {}),
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = type !== "glow";
      mesh.receiveShadow = true;
      group.add(mesh);
    });
    this.extras.forEach((m) => group.add(m));
    return group;
  }
}
export function windowFrame(b, x, y, z, w = 0.52, h = 0.75) {
  b.box([x, y, z], [w + 0.13, h + 0.13, 0.1], C.wood);
  b.box([x, y, z + 0.061], [w, h, 0.018], C.light, [0, 0, 0], "glow");
  b.box([x, y, z + 0.083], [0.045, h, 0.03], C.trim);
  b.box([x, y, z + 0.083], [w, 0.04, 0.03], C.trim);
  b.box([x, y - h / 2 - 0.07, z + 0.1], [w + 0.25, 0.11, 0.23], C.trim);
}
export function roof(b, x, y, z, w, d, h, color = C.roof) {
  b.extrude(
    [
      [-w / 2, 0],
      [0, h],
      [w / 2, 0],
    ],
    d,
    [x, y, z - d / 2],
    color,
  );
  const slope = Math.atan2(h, w / 2),
    len = Math.hypot(w / 2, h);
  // Individual overlapping courses, ridge caps and fascia, rather than a pyramid.
  for (let side of [-1, 1])
    for (let row = 0; row < 7; row++) {
      const f = (row + 0.5) / 7;
      for (let j = 0; j < Math.ceil(d / 0.3); j++)
        b.box(
          [
            x + ((side * w) / 2) * f,
            y + h * (1 - f) + 0.045,
            z - d / 2 + ((j + 0.5) * d) / Math.ceil(d / 0.3),
          ],
          [len / 7 + 0.028, 0.055, d / Math.ceil(d / 0.3) - 0.018],
          row % 2 ? color : "#487071",
          [0, 0, -side * slope],
        );
    }
  b.line(
    [x, y + h + 0.08, z - d / 2 - 0.07],
    [x, y + h + 0.08, z + d / 2 + 0.07],
    0.09,
    C.gold,
  );
  for (let zz of [z - d / 2 - 0.06, z + d / 2 + 0.06])
    for (let s of [-1, 1])
      b.line([x, y + h, zz], [x + (s * w) / 2, y, zz], 0.055, C.trim);
}
export function tree(b, x, z, s = 1, color = "#647a44", seed = 1) {
  const rand = rng(seed);
  const h = 1.5 * s;
  b.cyl([x, h * 0.42, z], 0.055 * s, 0.12 * s, h * 0.84, C.wood, 7);
  for (let i = 0; i < 5; i++) {
    const a = i * 2.4,
      dx = Math.cos(a) * 0.36 * s,
      dz = Math.sin(a) * 0.36 * s,
      yy = h * (0.7 + rand() * 0.45);
    b.line([x, h * 0.5, z], [x + dx, yy, z + dz], 0.045 * s, C.wood);
    b.ball(
      [x + dx, yy, z + dz],
      [s * (0.48 + rand() * 0.13), s * (0.42 + rand() * 0.16), s * 0.49],
      i % 2 ? color : "#849456",
      true,
    );
  }
}
export function pine(b, x, z, s = 1) {
  b.cyl([x, s * 0.8, z], 0.07 * s, 0.11 * s, 1.6 * s, C.wood, 7);
  for (let i = 0; i < 4; i++)
    b.cyl(
      [x, s * (0.85 + i * 0.35), z],
      0.02,
      s * (0.62 - i * 0.12),
      s * 0.85,
      i % 2 ? "#486b55" : "#345845",
      7,
      [0, i * 0.7, 0],
    );
}
export function lamp(b, x, z, y = 0) {
  b.cyl([x, y + 0.07, z], 0.15, 0.18, 0.14, C.stone);
  b.cyl([x, y + 0.72, z], 0.032, 0.045, 1.4, C.dark, 8);
  b.box([x, y + 1.4, z], [0.25, 0.32, 0.25], C.gold);
  b.box([x, y + 1.41, z], [0.19, 0.25, 0.19], C.light, [0, 0, 0], "glow");
  b.cyl([x, y + 1.63, z], 0, 0.22, 0.18, C.dark, 4, [0, Math.PI / 4, 0]);
}
export function bench(b, x, z, angle = 0) {
  const sub = new Builder();
  for (let i = 0; i < 4; i++) {
    sub.box([0, 0.38, (i - 1.5) * 0.09], [0.95, 0.065, 0.075], C.wood);
    sub.box([0, 0.65 + i * 0.08, -0.2], [0.95, 0.065, 0.07], C.wood);
  }
  for (let s of [-0.37, 0.37]) {
    sub.box([s, 0.2, 0], [0.07, 0.4, 0.32], C.dark);
    sub.box([s, 0.56, -0.2], [0.06, 0.8, 0.06], C.dark);
  }
  const g = sub.finish("bench");
  g.position.set(x, 0, z);
  g.rotation.y = angle;
  b.extras.push(g);
}
