// @ts-check
import * as THREE from 'three';
import { isPreflipped } from '../../lib/images.js';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders.js';

/** Tessellation of each poster; enough for smooth curvature at the widest field of view. */
const SEGMENTS_X = 32;
const SEGMENTS_Y = 18;
/** Anisotropic filtering beyond this costs fill rate on mobile GPUs (Quest) for no visible gain. */
const MAX_ANISOTROPY = 4;

/**
 * Thin three.js wrapper: owns the renderer and the poster meshes. Projection happens in the
 * vertex shader, so the three.js camera is a placeholder and frustum culling is disabled.
 *
 * @param {HTMLCanvasElement} canvas
 */
export function createDomeScene(canvas) {
  // No MSAA: poster edges are anti-aliased in the fragment shader (rounded-box alpha over a quad that
  // bleeds past the poster), so multisampling would only cost fill rate and bandwidth.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const geometry = new THREE.PlaneGeometry(2, 2, SEGMENTS_X, SEGMENTS_Y);
  const anisotropy = Math.min(MAX_ANISOTROPY, renderer.capabilities.getMaxAnisotropy());

  /** Uniforms shared by every poster (one object, referenced by all materials). */
  const shared = {
    uCameraYaw: { value: 0 },
    uStrength: { value: 0.5 },
    uScreen: { value: new THREE.Vector4(1, 1, 0, 0) },
    uPlaceholder: { value: new THREE.Color() },
    uDimColor: { value: new THREE.Color() },
    uHighlightColor: { value: new THREE.Color() },
    uRadius: { value: 12 },
    uRingWidth: { value: 2 },
  };

  function createPosterMesh() {
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        ...shared,
        uMap: { value: null },
        uHasMap: { value: 0 },
        uMapAspect: { value: 16 / 9 },
        uMapPrevious: { value: null },
        uHasPrevious: { value: 0 },
        uPreviousAspect: { value: 16 / 9 },
        uBlend: { value: 1 },
        uCard: { value: new THREE.Vector4() },
        uShift: { value: 0 },
        uDim: { value: 0 },
        uHighlight: { value: 0 },
        uDissolve: { value: 0 },
        uEdgeBlur: { value: 0 },
        uBleed: { value: new THREE.Vector2(0, 0) },
        uBox: { value: new THREE.Vector2(160, 90) },
      },
    });
    const { uniforms } = material;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);
    /** @type {THREE.Texture | null} */
    let texture = null;
    /** @type {THREE.Texture | null} */
    let previous = null;
    /** @type {TextureSource | null} */
    let source = null;

    return {
      mesh,
      uniforms,
      /**
       * Paints a picture (decoded image) or a playing video onto the poster with `object-fit: cover`.
       * With `fade`, the previous picture (or the placeholder) crossfades into the new one;
       * drive it with `advanceFade`.
       * @param {TextureSource | null} next
       * @param {{ fade?: boolean }} [options]
       */
      setSource(next, { fade = false } = {}) {
        if (next === source) return;
        previous?.dispose();
        previous = null;
        uniforms.uHasPrevious.value = 0;
        if (fade && texture) {
          previous = texture;
          uniforms.uMapPrevious.value = previous;
          uniforms.uHasPrevious.value = 1;
          uniforms.uPreviousAspect.value = uniforms.uMapAspect.value;
        } else {
          texture?.dispose();
        }
        texture = null;
        source = next;
        uniforms.uHasMap.value = 0;
        uniforms.uBlend.value = fade ? 0 : 1;
        if (!next) return;

        const isVideo = next instanceof HTMLVideoElement;
        texture = isVideo ? new THREE.VideoTexture(next) : new THREE.Texture(next);
        texture.flipY = !isPreflipped(next);
        texture.anisotropy = anisotropy;
        texture.minFilter = isVideo ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter;
        texture.needsUpdate = true;
        uniforms.uMap.value = texture;
        uniforms.uHasMap.value = 1;
        const width = isVideo ? next.videoWidth : next instanceof HTMLImageElement ? next.naturalWidth : next.width;
        const height = isVideo ? next.videoHeight : next instanceof HTMLImageElement ? next.naturalHeight : next.height;
        // The shader crops to the poster's current shape (object-fit: cover).
        uniforms.uMapAspect.value = width && height ? width / height : 16 / 9;
      },
      /**
       * Advances a running crossfade. Returns true while it is still in progress.
       * @param {number} dt        ms
       * @param {number} duration  ms
       */
      advanceFade(dt, duration) {
        if (uniforms.uBlend.value >= 1) return false;
        uniforms.uBlend.value = duration <= 1 ? 1 : Math.min(1, uniforms.uBlend.value + dt / duration);
        if (uniforms.uBlend.value < 1) return true;
        previous?.dispose();
        previous = null;
        uniforms.uHasPrevious.value = 0;
        return false;
      },
      dispose() {
        scene.remove(mesh);
        texture?.dispose();
        previous?.dispose();
        material.dispose();
      },
    };

  }

  return {
    shared,
    createPosterMesh,
    /**
     * @param {number} width   CSS px
     * @param {number} height  CSS px
     */
    resize(width, height) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
    },
    render() {
      renderer.render(scene, camera);
    },
  };
}

/** @typedef {ReturnType<ReturnType<typeof createDomeScene>['createPosterMesh']>} PosterMesh */

/** @typedef {import('../../lib/images.js').Picture | HTMLVideoElement} TextureSource */
