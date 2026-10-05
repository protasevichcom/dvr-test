// @ts-check
/**
 * Spherical mapping and projection shared by the vertex shader (shaders.js) and JS
 * (hit-testing, overlay placement, layout fitting). Keep both in sync.
 *
 * Spaces
 *  - Sphere: yaw (longitude, + right) and pitch (latitude, + down), radians. Cards are cells of a
 *    yaw × pitch grid, so their edges run along meridians and parallels; a card's shape is
 *    re-derived from the sphere wherever it is, never baked.
 *  - World: viewer at the origin, looking down -Z at yaw 0; +X right, +Y up.
 *  - Camera: world rotated by the camera yaw.
 *  - Screen: fisheye projection of camera directions. The angle θ from the gaze maps to
 *    r = tan(θ·s) / s. s = 1 is a flat camera, s → 0 an equidistant fisheye; s ≈ 0.5
 *    (stereographic) keeps shapes natural while the grid bends with the dome.
 */

/** @typedef {[number, number, number]} Vec3 */

/** @param {Vec3} v @param {number} a @returns {Vec3} */
export function rotateY([x, y, z], a) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [c * x + s * z, y, -s * x + c * z];
}

/**
 * @param {number} yaw
 * @param {number} pitch
 * @returns {Vec3}
 */
export function sphereToWorld(yaw, pitch) {
  return [Math.cos(pitch) * Math.sin(yaw), -Math.sin(pitch), -Math.cos(pitch) * Math.cos(yaw)];
}

/**
 * @param {Vec3} direction  unit vector
 * @returns {{ yaw: number, pitch: number }}
 */
export function worldToSphere([x, y, z]) {
  return { yaw: Math.atan2(x, -z), pitch: Math.asin(Math.max(-1, Math.min(1, -y))) };
}

/**
 * Camera direction → screen offset in projection units (x right, y down).
 * @param {Vec3} direction
 * @param {number} strength  s in r = tan(θ·s) / s
 * @returns {[number, number]}
 */
export function project([x, y, z], strength) {
  const length = Math.hypot(x, y, z);
  const theta = Math.acos(Math.min(1, Math.max(-1, -z / length)));
  const planar = Math.hypot(x, y);
  if (planar < 1e-9) return [0, 0];
  const r = Math.tan(Math.min(theta * strength, 1.55)) / strength;
  return [(x / planar) * r, (-y / planar) * r];
}

/**
 * Screen offset in projection units → camera direction.
 * @param {number} u
 * @param {number} v
 * @param {number} strength
 * @returns {Vec3}
 */
export function unproject(u, v, strength) {
  const r = Math.hypot(u, v);
  if (r < 1e-9) return [0, 0, -1];
  const theta = Math.atan(r * strength) / strength;
  const sin = Math.sin(theta);
  return [(u / r) * sin, (-v / r) * sin, -Math.cos(theta)];
}

/**
 * Sphere point → screen offset (projection units) for a camera at `cameraYaw`.
 * @param {number} yaw
 * @param {number} pitch
 * @param {number} cameraYaw
 * @param {number} strength
 */
export function sphereToScreen(yaw, pitch, cameraYaw, strength) {
  return project(rotateY(sphereToWorld(yaw, pitch), cameraYaw), strength);
}

/**
 * Screen offset (projection units) → sphere point, for a camera at `cameraYaw`.
 * @param {number} u
 * @param {number} v
 * @param {number} cameraYaw
 * @param {number} strength
 */
export function screenToSphere(u, v, cameraYaw, strength) {
  return worldToSphere(rotateY(unproject(u, v, strength), -cameraYaw));
}

/**
 * Smallest signed difference between two angles, in (-π, π].
 * @param {number} a
 * @param {number} b
 */
export function angleDelta(a, b) {
  const d = (a - b) % (2 * Math.PI);
  if (d > Math.PI) return d - 2 * Math.PI;
  if (d <= -Math.PI) return d + 2 * Math.PI;
  return d;
}
