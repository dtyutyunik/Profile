import * as THREE from "three";
import { Builder, C, rng, tree, pine, lamp, bench } from "./geometry";

export const riverX = (z) => 2.08 + Math.sin(z * 0.57) * 0.9;
export function edge(a) {
  const r = 1 + 0.035 * Math.sin(a * 7) + 0.026 * Math.cos(a * 11);
  return [Math.cos(a) * 10.1 * r, Math.sin(a) * 7.85 * r];
}
function terrainHeight(x, z) {
  const river = Math.abs(x - riverX(z));
  return (
    -0.42 * Math.max(0, 1 - river / 0.95) +
    0.045 *
      Math.sin(x * 1.8) *
      Math.sin(z * 1.3) *
      Math.min(1, Math.max(0, river - 0.8))
  );
}
function ribbon(points, width, height, color, b) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, z]) => new THREE.Vector3(x, height, z)),
  );
  const verts = [];
  for (let i = 0; i < 100; i++) {
    const t = i / 100,
      u = (i + 1) / 100,
      p = curve.getPoint(t),
      q = curve.getPoint(u),
      tangent = curve.getTangent(t),
      normal = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(
        width / 2,
      );
    const a = p.clone().add(normal),
      bb = p.clone().sub(normal),
      c = q.clone().add(normal),
      d = q.clone().sub(normal);
    [a, bb, c, bb, d, c].forEach((v) => verts.push(...v.toArray()));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  g.computeVertexNormals();
  b.add(g, color);
  g.dispose();
  return curve;
}
function bridge(b, x, z, length = 2.8) {
  // Cambered footbridge, individual planks, trusses, handrails and stone abutments.
  const y = (t) => 0.1 + Math.sin(t * Math.PI) * 0.32;
  for (let i = 0; i < 23; i++) {
    const t = (i + 0.5) / 23;
    b.box(
      [x + (t - 0.5) * length, y(t), z],
      [length / 23 - 0.012, 0.1, 0.96],
      i % 3 ? "#ad8556" : "#c39e68",
      [0, 0, Math.cos(t * Math.PI) * 0.1],
    );
  }
  for (let end of [-1, 1])
    b.box([x + (end * length) / 2, -0.02, z], [0.4, 0.22, 1.15], C.stone);
  for (let side of [-0.48, 0.48])
    for (let i = 0; i < 9; i++) {
      const t = i / 8,
        xx = x + (t - 0.5) * length;
      b.line([xx, y(t), z + side], [xx, y(t) + 0.64, z + side], 0.035, C.wood);
      if (i) {
        const pt = (i - 1) / 8,
          px = x + (pt - 0.5) * length;
        b.line(
          [px, y(pt) + 0.64, z + side],
          [xx, y(t) + 0.64, z + side],
          0.038,
          C.wood,
        );
        b.line(
          [px, y(pt) + 0.14, z + side],
          [xx, y(t) + 0.52, z + side],
          0.022,
          C.wood,
        );
      }
    }
}
export function buildLandscape() {
  const b = new Builder(),
    rand = rng(118),
    segments = 112;
  // Concentric sculpted terrain with a depressed river bed. Shared winding matches water.
  const verts = [],
    colors = [];
  function tri(a, bb, c) {
    [a, bb, c].forEach((v) => verts.push(...v));
    const x = (a[0] + bb[0] + c[0]) / 3,
      z = (a[2] + bb[2] + c[2]) / 3;
    const bank = Math.abs(x - riverX(z)) < 1.12;
    const color = new THREE.Color(
      bank ? "#b3a37b" : rand() > 0.5 ? "#869565" : "#8c9b69",
    ).multiplyScalar(0.96 + rand() * 0.08);
    for (let i = 0; i < 3; i++) colors.push(color.r, color.g, color.b);
  }
  for (let ring = 0; ring < 40; ring++)
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * 6.2831853,
        aa = ((i + 1) / segments) * 6.2831853;
      const [x, z] = edge(a),
        [xx, zz] = edge(aa),
        r = ring / 40,
        rr = (ring + 1) / 40;
      const p = [x * r, terrainHeight(x * r, z * r), z * r],
        q = [xx * r, terrainHeight(xx * r, zz * r), zz * r],
        s = [x * rr, terrainHeight(x * rr, z * rr), z * rr],
        t = [xx * rr, terrainHeight(xx * rr, zz * rr), zz * rr];
      tri(p, t, s);
      tri(p, q, t);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  const ground = new THREE.Mesh(
    g,
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
  );
  ground.receiveShadow = true;
  b.extras.push(ground);
  // Exposed geological strata: offset triangulated rings, fractured ledges, scree.
  for (let level = 0; level < 4; level++) {
    const vs = [],
      cs = [];
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2,
        aa = ((i + 1) / segments) * Math.PI * 2;
      const [x, z] = edge(a),
        [xx, zz] = edge(aa),
        f = 1 - level * 0.033,
        ff = 1 - (level + 1) * 0.033;
      const top = -level * 0.64,
        bottom = -(level + 1) * 0.64;
      const p = [
        x * f,
        top + (level ? Math.sin(i * 2) * 0.09 : terrainHeight(x, z)),
        z * f,
      ];
      const q = [
        xx * f,
        top + (level ? Math.sin((i + 1) * 2) * 0.09 : terrainHeight(xx, zz)),
        zz * f,
      ];
      const s = [x * ff, bottom + Math.sin(i * 1.8) * 0.12, z * ff],
        t = [xx * ff, bottom + Math.sin((i + 1) * 1.8) * 0.12, zz * ff];
      [p, q, t, p, t, s].forEach((v) => vs.push(...v));
      const c = new THREE.Color(
        ["#aca58b", "#8c8270", "#716d61", "#605c52"][level],
      ).multiplyScalar(0.83 + rand() * 0.3);
      for (let k = 0; k < 6; k++) cs.push(c.r, c.g, c.b);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vs, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(cs, 3));
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    b.extras.push(mesh);
  }
  // Rim boulders, moss, and miniature flower meadows.
  for (let i = 0; i < 190; i++) {
    const a = rand() * 6.283,
      [ex, ez] = edge(a),
      r = 0.91 + rand() * 0.06,
      x = ex * r,
      z = ez * r;
    if (Math.abs(x - riverX(z)) < 1.0) continue;
    const s = 0.15 + rand() * 0.36;
    b.rock(
      [x, -0.1, z],
      [s, s * 0.55, s * 0.72],
      i % 4 ? "#98937b" : "#b9ad87",
    );
    if (i % 4 === 0)
      b.ball([x, 0.1, z], [s * 0.7, s * 0.3, s * 0.7], "#7c8a53", true);
  }
  // Rivers and stone promenades.
  ribbon(
    [
      [-5, -1],
      [-4, 1],
      [-2, 2.5],
      [0, 3],
      [2, 3.25],
      [3.8, 3.6],
    ],
    0.86,
    0.054,
    "#c6b48b",
    b,
  );
  ribbon(
    [
      [-1, -0.1],
      [-1.3, 1.3],
      [-2, 2.5],
      [-3.4, 4.6],
      [-5.5, 5.9],
    ],
    0.76,
    0.056,
    "#cbbb98",
    b,
  );
  ribbon(
    [
      [0, -3.9],
      [2, -3.8],
      [4, -3.6],
      [5.2, -2],
    ],
    0.8,
    0.052,
    "#c6b48b",
    b,
  );
  // Central compass plaza with paved perimeter and fountain.
  b.cyl([-2.2, 0.062, 2.7], 1.3, 1.3, 0.045, "#b3a789", 48);
  for (let i = 0; i < 40; i++) {
    const a = (i * 6.283) / 40;
    b.box(
      [-2.2 + Math.sin(a) * 1.18, 0.101, 2.7 + Math.cos(a) * 1.18],
      [0.14, 0.025, 0.26],
      i % 2 ? C.cream : C.stone,
      [0, a, 0],
    );
  }
  b.cyl([-2.2, 0.17, 2.7], 0.47, 0.58, 0.22, C.stone, 24);
  b.cyl([-2.2, 0.3, 2.7], 0.5, 0.5, 0.07, C.trim, 24);
  b.cyl([-2.2, 0.343, 2.7], 0.43, 0.43, 0.01, "#65aaa3", 24);
  b.cyl([-2.2, 0.54, 2.7], 0.09, 0.12, 0.42, C.cream, 12);
  b.cyl([-2.2, 0.77, 2.7], 0.28, 0.1, 0.13, C.trim, 20);
  bridge(b, riverX(3.22), 3.22, 2.8);
  bridge(b, riverX(-3.77), -3.77, 2.7);
  // Cobblestones along the promenade edges and the winding river banks.
  for (let i = 0; i < 100; i++) {
    const z = -7.4 + i * 0.149,
      x = riverX(z),
      r = 0.075 + rand() * 0.07;
    for (let side of [-1, 1])
      b.rock(
        [x + side * (0.75 + rand() * 0.2), -0.015, z],
        [r, 0.07, r * 0.9],
        "#aaa184",
      );
  }
  // Planting is clustered in habitats, leaving destinations and paths readable.
  const trees = [
    [-8, -1, 1.2],
    [-7.7, 1.4, 1],
    [-7.1, 3.2, 1.15],
    [-6, 4.6, 0.82],
    [-4.5, 5.8, 0.92],
    [-2, 6.5, 0.72],
    [-0.5, 6.1, 0.8],
    [5.4, 5, 0.85],
    [6.7, 4.3, 1.05],
    [8, 1.5, 0.96],
    [8.2, -0.6, 0.7],
    [7.7, -3.5, 0.85],
    [-7, -4.1, 1],
    [-5.3, -5.5, 1.1],
    [-3.5, -5.7, 0.8],
    [-1.8, -5.8, 0.9],
    [0.1, -6, 0.7],
    [3.8, -5.7, 0.7],
  ];
  trees.forEach(([x, z, s], i) =>
    i % 4 === 0
      ? pine(b, x, z, s * 1.15)
      : tree(b, x, z, s, i % 3 ? "#647d4c" : "#bc9658", i + 2),
  );
  for (let i = 0; i < 170; i++) {
    const x = rand() * 18 - 9,
      z = rand() * 13 - 6.5;
    if ((x * x) / 91 + (z * z) / 57 > 0.94 || Math.abs(x - riverX(z)) < 1.2)
      continue;
    if (
      [
        [-5.3, -2.4, 2.7],
        [-0.8, -0.8, 2.9],
        [5, -2.7, 2.5],
        [4.1, 3.7, 2.4],
        [-2.2, 2.7, 1.65],
      ].some(([xx, zz, r]) => Math.hypot(x - xx, z - zz) < r)
    )
      continue;
    const s = 0.12 + rand() * 0.22;
    b.ball([x, 0.1, z], [s, 0.16, s], "#6f844a", true);
    if (i % 3 === 0)
      for (let j = 0; j < 3; j++)
        b.ball(
          [x + (j - 1) * 0.08, 0.26 + rand() * 0.05, z],
          [0.04, 0.045, 0.04],
          i % 2 ? "#eec381" : "#d9927f",
        );
  }
  [
    [-4.6, 1.1],
    [-3.2, 4.4],
    [-0.5, 2.75],
    [0.4, -3.95],
    [4, -4.3],
    [5.9, 2.3],
  ].forEach(([x, z]) => lamp(b, x, z));
  bench(b, -3.8, 3.1, -0.45);
  bench(b, -0.5, 4.5, -0.3);
  // Harbor landing and mooring piles below the cliff.
  for (let i = 0; i < 19; i++)
    b.box(
      [-5.7 + i * 0.13, -1.72, 6.68],
      [0.116, 0.12, 2.3],
      i % 3 ? C.wood : "#ab8455",
    );
  for (let x of [-5.65, -3.5])
    for (let z of [5.65, 7.69]) {
      b.cyl([x, -1.9, z], 0.09, 0.12, 1.2, C.wood, 9);
      b.cyl([x, -1.31, z], 0.115, 0.115, 0.09, C.cream, 9);
    }
  for (let i = 0; i < 12; i++)
    b.box(
      [-4.9, -0.1 - i * 0.14, 5.3 + i * 0.085],
      [0.83, 0.13, 0.21],
      C.stone,
    );
  // Coastal rocks make contact with the sea, anchoring the island.
  for (let i = 0; i < 24; i++) {
    const a = rand() * 6.283,
      [x, z] = edge(a);
    b.rock(
      [x * (1 + rand() * 0.06), -2.45, z * (1 + rand() * 0.07)],
      [0.3 + rand() * 0.6, 0.4 + rand() * 0.4, 0.4 + rand() * 0.5],
      "#77796c",
    );
  }
  return b.finish("Sculpted island");
}

export function buildBackdrop() {
  const b = new Builder(),
    rand = rng(919);
  // Sculpted continuous mountain ridges, softened in atmospheric layers.
  for (let layer = 0; layer < 3; layer++) {
    const vertices = [],
      cols = [],
      nx = 96,
      nz = 12;
    function point(i, j) {
      const x = -65 + (i * 130) / nx,
        z = -28 - layer * 12 - j * 1.8;
      const ridge = Math.pow(Math.sin((j / nz) * Math.PI), 1.5);
      const peaks =
        2.5 +
        2.3 * Math.sin(x * 0.11 + layer) +
        1.1 * Math.cos(x * 0.32) +
        0.6 * Math.sin(x * 0.9);
      return [x, -2.5 + ridge * Math.max(0.3, peaks) * (1 + layer * 0.18), z];
    }
    for (let i = 0; i < nx; i++)
      for (let j = 0; j < nz; j++) {
        const p = point(i, j),
          q = point(i + 1, j),
          r = point(i, j + 1),
          t = point(i + 1, j + 1);
        [p, q, t, p, t, r].forEach((v) => vertices.push(...v));
        const c = new THREE.Color(
          ["#b1baaa", "#c3c8b4", "#d0ceba"][layer],
        ).multiplyScalar(0.98 + rand() * 0.04);
        for (let k = 0; k < 6; k++) cols.push(c.r, c.g, c.b);
      }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }),
    );
    b.extras.push(mesh);
  }
  // A distant shoreline gives the tiny city a believable footing in the bay.
  b.cyl([-12, -2.49, -23], 1, 1, 0.13, "#a7b3a1", 60);
  const shore = new THREE.SphereGeometry(1, 48, 8);
  b.add(shore, "#a7b3a1", [-12, -2.7, -23], [12, 0.5, 3]);
  shore.dispose();
  for (let i = 0; i < 27; i++) {
    const x = -21 + i * 0.66,
      z = -23 - rand() * 1.8,
      h = 0.4 + rand() * 1.7;
    b.box(
      [x, h / 2 - 2.3, z],
      [0.35 + rand() * 0.35, h, 0.5],
      i % 2 ? "#a3b2a3" : "#99ac9f",
    );
    if (i % 5 === 0) {
      b.box([x, h - 2.23, z], [0.24, 0.18, 0.32], "#a0afa0");
      b.line([x, h - 2.2, z], [x, h - 1.55, z], 0.023, "#a1afa0");
    }
    for (let y = 0.25; y < h - 0.1; y += 0.24)
      b.box([x, y - 2.3, z + 0.255], [0.28, 0.025, 0.009], "#b6c1ae");
  }
  return b.finish("Horizon");
}
