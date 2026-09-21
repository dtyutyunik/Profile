import * as THREE from "three";
import { Builder, C, roof, windowFrame, lamp, bench, rng } from "./geometry";

function steps(b, w, z, y = 0.35) {
  for (let i = 0; i < 4; i++)
    b.box(
      [0, ((i + 1) * y) / 4 / 2, z - i * 0.17],
      [w, ((i + 1) * y) / 4, 0.6],
      i % 2 ? C.stone : C.cream,
    );
}
function planter(b, x, z, w = 0.7) {
  b.box([x, 0.16, z], [w, 0.32, 0.35], C.terracotta);
  for (let i = 0; i < 5; i++) {
    b.ball(
      [x - w * 0.4 + i * w * 0.2, 0.4, z],
      [0.18, 0.19, 0.19],
      "#6d824b",
      true,
    );
    if (i % 2)
      b.ball(
        [x - w * 0.4 + i * w * 0.2, 0.53, z + 0.03],
        [0.06, 0.06, 0.06],
        "#e3a77d",
      );
  }
}
function awning(b, x, y, z, w, color) {
  for (let i = 0; i < 12; i++) {
    b.box(
      [x - w / 2 + ((i + 0.5) * w) / 12, y, z],
      [w / 12 - 0.007, 0.065, 0.85],
      i % 2 ? C.trim : color,
      [0.19, 0, 0],
    );
    b.box(
      [x - w / 2 + ((i + 0.5) * w) / 12, y - 0.15, z + 0.41],
      [w / 12 - 0.007, 0.22, 0.04],
      i % 2 ? C.trim : color,
    );
  }
}
function chimney(b, x, y, z) {
  b.box([x, y, z], [0.4, 1.1, 0.45], C.brick);
  for (let i = 0; i < 5; i++)
    b.box([x, y - 0.45 + i * 0.19, z + 0.231], [0.42, 0.025, 0.015], C.plaster);
  b.box([x, y + 0.53, z], [0.54, 0.12, 0.59], C.cream);
  b.box([x, y + 0.6, z], [0.3, 0.025, 0.35], C.dark);
}
export function buildCinema() {
  const b = new Builder();
  b.box([0, 0.12, 0], [4.2, 0.24, 3.35], C.stone);
  b.box([0, 1.26, -0.15], [3.6, 2.25, 2.65], "#ac6550");
  b.box([0, 2.45, -0.15], [3.86, 0.18, 2.92], C.trim);
  b.box([0, 2.57, -0.15], [3.66, 0.13, 2.75], C.roof);
  // Art deco stepped frontage and stone pilasters.
  for (let x of [-1.7, 1.7]) {
    b.box([x, 1.7, 1.25], [0.34, 3.15, 0.37], C.cream);
    b.box([x, 3.32, 1.25], [0.46, 0.1, 0.49], C.gold);
    for (let dx of [-0.085, 0, 0.085])
      b.box([x + dx, 1.7, 1.46], [0.025, 2.9, 0.025], C.gold);
  }
  b.box([0, 2.88, 1.18], [3.15, 1.02, 0.28], C.cream);
  b.box([0, 3.46, 1.18], [2.5, 0.2, 0.32], C.cream);
  b.sign("CINEMA", [0, 2.98, 1.335], 2.5, 0.59, "#563e35", "#ffe2a0");
  for (let x of [-0.36, 0.36]) {
    b.box([x, 0.86, 1.225], [0.65, 1.3, 0.12], C.dark);
    b.box([x, 0.99, 1.3], [0.49, 0.77, 0.035], "#426969");
    b.box([x, 0.5, 1.31], [0.48, 0.23, 0.03], C.gold);
    b.line([x + 0.19, 0.67, 1.36], [x + 0.19, 0.94, 1.36], 0.022, C.gold);
  }
  b.box([0, 2.02, 1.72], [3.85, 0.35, 1.13], "#7c3f38");
  b.box([0, 2.2, 1.72], [3.98, 0.09, 1.22], C.gold);
  b.sign("THE STORY SO FAR", [0, 2.03, 2.292], 3.5, 0.28, "#fff0cd", "#663f31");
  for (let i = 0; i < 20; i++)
    b.ball([-1.78 + i * 0.187, 1.84, 2.21], [0.039, 0.039, 0.039], C.light);
  for (let x of [-1.16, 1.16]) {
    b.box([x, 1.05, 1.245], [0.63, 1.04, 0.14], C.gold);
    b.sign(
      x < 0 ? "ACT I" : "ACT II",
      [x, 1.06, 1.322],
      0.51,
      0.88,
      x < 0 ? "#234f51" : "#b47742",
      "#ffe3b0",
      [0, 0, 0],
      x < 0 ? "FINANCE" : "ENGINEERING",
    );
  }
  steps(b, 2.7, 2.2, 0.23);
  // Rooftop sculptural popcorn bucket: tapered striped container and kernels.
  b.cyl([-0.7, 3.04, -0.32], 0.53, 0.37, 1.02, "#e6d5a3", 12);
  for (let i = 0; i < 12; i += 2) {
    const a = (i * Math.PI) / 6;
    b.box(
      [-0.7 + Math.sin(a) * 0.44, 3.03, -0.32 + Math.cos(a) * 0.44],
      [0.17, 0.88, 0.04],
      "#ac4c3d",
      [0, a, 0],
    );
  }
  b.torus([-0.7, 3.56, -0.32], 0.53, 0.055, C.trim, [Math.PI / 2, 0, 0]);
  const rand = rng(84);
  for (let i = 0; i < 28; i++) {
    let a = rand() * 6.28,
      r = Math.sqrt(rand()) * 0.47;
    b.ball(
      [-0.7 + Math.cos(a) * r, 3.58 + rand() * 0.25, -0.32 + Math.sin(a) * r],
      [0.15, 0.14, 0.15],
      i % 3 ? C.trim : "#dab77a",
      true,
    );
  }
  b.cyl([0.85, 3.08, -0.3], 0.52, 0.52, 0.12, C.gold, 32, [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 5; i++) {
    const a = (i * 6.28) / 5;
    b.cyl(
      [0.85 + Math.cos(a) * 0.3, 3.08 + Math.sin(a) * 0.3, -0.22],
      0.11,
      0.11,
      0.016,
      C.dark,
      12,
      [Math.PI / 2, 0, 0],
    );
  }
  // Popcorn cart, brass stanchions, and entrance planting.
  b.box([-2.18, 0.5, 1.3], [0.65, 0.63, 0.6], "#bd6450");
  for (let x of [-2.47, -1.89])
    b.cyl([x, 0.19, 1.3], 0.16, 0.16, 0.08, C.dark, 12, [0, 0, Math.PI / 2]);
  for (let x of [-2.46, -1.9])
    b.line([x, 0.7, 1.3], [x, 1.48, 1.3], 0.024, C.gold);
  awning(b, -2.18, 1.49, 1.3, 0.82, "#b75546");
  for (let x of [-1.04, 1.04]) lamp(b, x, 2.5);
  planter(b, 1.97, 1.35, 0.5);
  return b.finish("Career Cinema");
}
export function buildWorkshop() {
  const b = new Builder();
  b.box([0, 0.1, 0], [4.1, 0.2, 3.6], C.stone);
  b.box([0, 1.06, -0.27], [3.4, 1.95, 2.7], C.plaster);
  for (let y of [0.25, 0.6, 0.95, 1.3, 1.65])
    b.box([0, y, 1.094], [3.38, 0.018, 0.01], "#bf9d74");
  for (let x of [-1.63, 0, 1.63])
    b.box([x, 1.07, 1.16], [0.13, 2.05, 0.14], C.wood);
  roof(b, 0, 2.09, -0.25, 3.8, 3.1, 0.92);
  // Glazed gable and ventilator.
  b.extrude(
    [
      [-0.58, 0],
      [0, 0.62],
      [0.58, 0],
    ],
    0.06,
    [0, 2.22, 1.345],
    C.glass,
  );
  for (let x of [-0.3, 0, 0.3])
    b.box([x, 2.4, 1.42], [0.035, 0.32, 0.045], C.trim);
  b.box([-0.86, 0.88, 1.18], [1.05, 1.55, 0.08], C.dark);
  for (let x of [-1.14, -0.62]) windowFrame(b, x, 1, 1.24, 0.4, 1.12);
  windowFrame(b, 0.81, 1.02, 1.17, 1.06, 0.93);
  b.sign("THE WORKSHOP", [0, 1.86, 1.18], 2.48, 0.33, "#34564e", "#ffe4ab");
  chimney(b, 1.22, 2.73, -0.98);
  b.cyl([-1.31, 2.83, -0.97], 0.24, 0.3, 0.7, C.gold, 12);
  b.cyl([-1.31, 3.22, -0.97], 0.32, 0.25, 0.12, C.dark, 12);
  // A conservatory annex, structural framing, and pitched glass roof.
  b.box([2.05, 0.7, -0.44], [0.82, 1.15, 1.8], C.teal);
  for (let z of [-1.18, -0.63, -0.08, 0.47]) {
    b.box([2.49, 0.92, z], [0.04, 0.96, 0.035], C.gold);
    b.box([2.51, 0.92, z - 0.24], [0.015, 0.78, 0.42], C.glass);
  }
  b.box([2.12, 1.65, -0.43], [1.3, 0.07, 2.0], C.glass, [0, 0, -0.27]);
  for (let z of [-1.28, -0.78, -0.28, 0.22, 0.57])
    b.box([2.12, 1.7, z], [1.34, 0.06, 0.04], C.gold, [0, 0, -0.27]);
  // Workbench, computer, tools, stacked crates, copper piping.
  b.box([0.38, 0.66, 1.91], [2.15, 0.13, 0.7], C.wood);
  for (let x of [-0.48, 1.24]) b.box([x, 0.31, 1.91], [0.1, 0.62, 0.1], C.dark);
  b.box([0.28, 1.04, 1.83], [0.61, 0.45, 0.07], C.dark);
  b.box([0.28, 1.05, 1.875], [0.53, 0.36, 0.018], C.glass, [0, 0, 0], "glow");
  b.box([0.28, 0.75, 1.83], [0.09, 0.24, 0.08], C.dark);
  b.box([0.29, 0.74, 2.04], [0.5, 0.035, 0.15], C.trim);
  for (let i = 0; i < 3; i++)
    b.box(
      [0.81 + i * 0.12, 0.8, 1.9],
      [0.055, 0.14 + i * 0.025, 0.055],
      ["#b76442", C.gold, C.teal][i],
    );
  for (let i = 0; i < 3; i++) {
    const x = -2.07 + (i % 2) * 0.5,
      y = 0.24 + Math.floor(i / 2) * 0.43;
    b.box([x, y, 0.87], [0.45, 0.42, 0.45], C.wood);
    for (let v of [-0.13, 0, 0.13])
      b.box([x + v, y, 1.103], [0.025, 0.4, 0.013], C.gold);
  }
  b.line([1.73, 0.24, -1.4], [1.73, 2.35, -1.4], 0.07, C.gold, "metal");
  b.line([1.73, 2.35, -1.4], [1.73, 2.35, -0.5], 0.07, C.gold, "metal");
  b.torus([1.83, 0.8, 0.9], 0.18, 0.025, "#ad743c", [0, Math.PI / 2, 0]);
  planter(b, -1.4, 1.7, 0.55);
  lamp(b, 1.86, 2.04);
  return b.finish("Tinkerer Workshop");
}
export function buildPublisher() {
  const b = new Builder();
  b.box([0, 0.13, 0], [3.2, 0.26, 2.9], C.stone);
  b.box([0, 1.32, -0.12], [2.62, 2.4, 2.24], "#bead99");
  b.box([0, 1.67, 1.025], [2.73, 0.13, 0.17], C.wood);
  for (let x of [-1.26, 0, 1.26])
    b.box([x, 1.31, 1.08], [0.12, 2.37, 0.1], C.wood);
  roof(b, 0, 2.6, -0.13, 3.03, 2.68, 1.02, "#486464");
  windowFrame(b, -0.67, 2.11, 1.08, 0.64, 0.58);
  windowFrame(b, 0.67, 2.11, 1.08, 0.64, 0.58);
  b.box([-0.73, 0.82, 1.08], [0.65, 1.32, 0.09], C.teal);
  b.box([-0.73, 0.99, 1.14], [0.46, 0.7, 0.025], C.light, [0, 0, 0], "glow");
  b.ball([-0.51, 0.61, 1.18], [0.035, 0.035, 0.035], C.gold);
  b.box([0.58, 0.9, 1.1], [1.18, 1.25, 0.16], C.wood);
  b.box([0.58, 0.9, 1.193], [1.05, 1.12, 0.026], C.dark);
  const colors = ["#c58951", "#8a6475", "#5b9690", "#b1a081", "#b86243"];
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 7; i++)
      b.box(
        [0.1 + i * 0.15, 0.47 + row * 0.34, 1.23],
        [0.11, 0.23 + (i % 3) * 0.027, 0.12],
        colors[(i + row) % 5],
        [0, 0, ((i % 3) - 1) * 0.06],
      );
    b.box([0.58, 0.31 + row * 0.34, 1.25], [1.12, 0.035, 0.22], C.gold);
  }
  awning(b, 0.12, 1.65, 1.58, 2.65, "#9c6752");
  b.sign("PUBLISHER HOUSE", [0, 2.53, 1.185], 2.33, 0.31, "#4c554c", "#ffe4b1");
  chimney(b, 0.85, 3.18, -0.8);
  // Dormer window and front gable clock.
  b.cyl([0, 2.99, 1.26], 0.23, 0.23, 0.055, C.gold, 24, [Math.PI / 2, 0, 0]);
  b.cyl([0, 2.99, 1.297], 0.185, 0.185, 0.015, C.trim, 24, [Math.PI / 2, 0, 0]);
  b.line([0, 2.99, 1.32], [0, 3.12, 1.32], 0.013, C.dark);
  b.line([0, 2.99, 1.32], [0.1, 2.94, 1.32], 0.013, C.dark);
  b.box([1.65, 0.42, 0.83], [0.65, 0.1, 0.7], C.wood);
  for (let i = 0; i < 4; i++)
    b.box([1.65, 0.52 + i * 0.055, 0.83], [0.47, 0.052, 0.33], colors[i], [
      0,
      (i - 2) * 0.12,
      0,
    ]);
  for (let x of [1.39, 1.9]) b.box([x, 0.2, 0.83], [0.05, 0.4, 0.05], C.wood);
  b.box([-1.65, 0.41, 1.2], [0.42, 0.68, 0.08], C.dark, [0.15, 0, 0]);
  b.sign("BOOKS", [-1.65, 0.46, 1.26], 0.35, 0.38, "#384b43", "#ffe4b1");
  planter(b, -1.08, 1.9, 0.67);
  lamp(b, 1.35, 1.99);
  bench(b, -2.03, -0.2, Math.PI / 2);
  return b.finish("Publisher House");
}
export function buildTraveler() {
  const b = new Builder();
  // Stone belvedere, turned columns, domed copper observatory and brass globe.
  b.cyl([0, 0.2, 0], 1.92, 2.1, 0.4, C.stone, 48);
  b.cyl([0, 0.44, 0], 1.84, 1.84, 0.12, C.cream, 48);
  for (let i = 0; i < 40; i++) {
    const a = (i * 6.283) / 40;
    b.box(
      [Math.sin(a) * 1.83, 0.48, Math.cos(a) * 1.83],
      [0.13, 0.05, 0.24],
      i % 2 ? C.plaster : C.cream,
      [0, a, 0],
    );
  }
  b.cyl([0, 0.74, -0.16], 0.45, 0.57, 0.52, C.wood, 24);
  b.cyl([0, 1.01, -0.16], 0.6, 0.46, 0.12, C.gold, 24);
  b.ball([0, 1.82, -0.16], [0.83, 0.83, 0.83], "#619e9a");
  // Project hand-drawn continental coastlines onto the globe, with curved
  // triangle subdivisions so land follows the sphere instead of floating dots.
  const continents = [
    [
      [-168, 72],
      [-136, 69],
      [-124, 58],
      [-126, 49],
      [-117, 32],
      [-100, 19],
      [-82, 8],
      [-77, 17],
      [-83, 25],
      [-66, 45],
      [-53, 52],
      [-62, 63],
      [-100, 76],
    ],
    [
      [-81, 12],
      [-64, 9],
      [-48, -3],
      [-35, -7],
      [-43, -23],
      [-57, -39],
      [-68, -55],
      [-76, -40],
      [-80, -9],
    ],
    [
      [-10, 36],
      [-10, 58],
      [10, 72],
      [35, 70],
      [60, 73],
      [100, 76],
      [140, 61],
      [178, 62],
      [154, 43],
      [130, 33],
      [120, 20],
      [106, 1],
      [95, 5],
      [85, 22],
      [68, 25],
      [54, 14],
      [39, 30],
      [26, 40],
    ],
    [
      [-18, 34],
      [3, 37],
      [34, 30],
      [50, 12],
      [43, -15],
      [33, -34],
      [17, -35],
      [9, -17],
      [-8, 4],
      [-17, 18],
    ],
    [
      [113, -22],
      [130, -12],
      [142, -11],
      [154, -27],
      [146, -39],
      [130, -33],
      [115, -35],
    ],
    [
      [-54, 59],
      [-26, 68],
      [-23, 81],
      [-48, 84],
      [-65, 75],
    ],
    [
      [46, -13],
      [50, -17],
      [47, -26],
      [43, -24],
    ],
  ];
  continents.forEach((outline) => {
    const contour = outline.map((p) => new THREE.Vector2(...p)),
      faces = THREE.ShapeUtils.triangulateShape(contour, []),
      vertices = [];
    const sphere = (p) => {
      const lon = (p.x * Math.PI) / 180,
        lat = (p.y * Math.PI) / 180,
        r = 0.849;
      return [
        Math.sin(lon) * Math.cos(lat) * r,
        Math.sin(lat) * r,
        Math.cos(lon) * Math.cos(lat) * r,
      ];
    };
    const subdivide = (a, c, d, level) => {
      if (!level) {
        const pa = sphere(a),
          pc = sphere(c),
          pd = sphere(d);
        const va = new THREE.Vector3(...pa),
          vc = new THREE.Vector3(...pc),
          vd = new THREE.Vector3(...pd);
        const outward =
          vc.clone().sub(va).cross(vd.clone().sub(va)).dot(va) > 0;
        vertices.push(...pa, ...(outward ? pc : pd), ...(outward ? pd : pc));
        return;
      }
      const ac = a.clone().add(c).multiplyScalar(0.5),
        cd = c.clone().add(d).multiplyScalar(0.5),
        da = d.clone().add(a).multiplyScalar(0.5);
      subdivide(a, ac, da, level - 1);
      subdivide(ac, c, cd, level - 1);
      subdivide(da, cd, d, level - 1);
      subdivide(ac, cd, da, level - 1);
    };
    faces.forEach(([a, c, d]) =>
      subdivide(contour[a], contour[c], contour[d], 3),
    );
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    b.add(geo, "#b9bb83", [0, 1.82, -0.16]);
    geo.dispose();
  });
  for (let latitude of [-0.5, 0.5])
    b.torus(
      [0, 1.82 + latitude * 0.83, -0.16],
      Math.sqrt(1 - latitude * latitude) * 0.834,
      0.008,
      C.gold,
      [Math.PI / 2, 0, 0],
    );
  b.torus([0, 1.82, -0.16], 0.93, 0.035, C.gold, [0, 0, 0.25]);
  b.torus([0, 1.82, -0.16], 0.843, 0.016, C.gold, [Math.PI / 2, 0, 0]);
  for (let x of [-1.38, 1.38])
    for (let z of [-1.0, 0.85]) {
      b.cyl([x, 1.61, z], 0.063, 0.084, 2.26, C.cream, 10);
      b.cyl([x, 2.74, z], 0.12, 0.12, 0.11, C.gold, 10);
      b.cyl([x, 0.58, z], 0.14, 0.16, 0.16, C.cream, 10);
    }
  roof(b, 0, 2.8, -0.95, 3.37, 1.1, 0.6);
  for (let x of [-1.38, 1.38])
    b.line([x, 2.78, -1.4], [x, 2.78, 0.88], 0.06, C.cream);
  b.sign("THE WIDE WORLD", [0, 2.67, -0.35], 2.1, 0.3, "#3e625a", "#ffe3b0");
  for (let i = 0; i < 19; i++) {
    const a = -Math.PI * 0.48 + (i / 18) * Math.PI * 0.96;
    const x = Math.cos(a) * 1.82,
      z = Math.sin(a) * 1.82;
    b.line([x, 0.52, z], [x, 1.0, z], 0.027, C.gold);
    if (i) {
      const prev = -Math.PI * 0.48 + ((i - 1) / 18) * Math.PI * 0.96;
      b.line(
        [Math.cos(prev) * 1.82, 1, Math.sin(prev) * 1.82],
        [x, 1, Math.sin(a) * 1.82],
        0.035,
        C.wood,
      );
    }
  }
  b.cyl([-1.05, 0.84, 1.28], 0.18, 0.26, 0.66, C.wood, 10);
  b.line([-1.05, 1.1, 1.28], [-0.55, 1.5, 1.28], 0.1, C.gold, "metal");
  b.cyl([-0.53, 1.52, 1.28], 0.13, 0.13, 0.06, C.dark, 14, [0, 0, -0.9]);
  for (let i = 0; i < 3; i++)
    b.box(
      [0.58 + i * 0.27, 0.7, 1.31],
      [0.23, 0.38 + (i % 2) * 0.1, 0.23],
      ["#b76d48", "#bc9a52", "#6a8d7b"][i],
    );
  for (let i = 0; i < 3; i++)
    b.box(
      [0.58 + i * 0.27, 0.94 + (i % 2) * 0.1, 1.31],
      [0.09, 0.045, 0.05],
      C.gold,
    );
  lamp(b, -1.9, 1.12);
  return b.finish("Traveler Overlook");
}
