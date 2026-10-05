// @ts-check
/**
 * GLSL for dome posters. The vertex stage mirrors projection.js (keep them in sync): every vertex
 * of a finely tessellated quad is placed by yaw/pitch on the sphere grid, then projected with the
 * fisheye r = tan(θ·s) / s. The poster is an image painted onto its grid cell; text never goes
 * through this path (it is flat DOM, see VideoCardOverlay).
 */

export const VERTEX_SHADER = /* glsl */ `
  uniform vec4 uCard;        // cell center yaw, pitch; half yaw, half pitch (rad)
  uniform float uShift;      // pitch offset of the poster (rad, + is down)
  uniform vec2 uBleed;       // extra quad size (share of the half size) for a blurred edge
  uniform float uCameraYaw;
  uniform float uStrength;
  uniform vec4 uScreen;      // projection units → NDC scale (xy), gaze center in NDC (zw)

  varying vec2 vUv;

  vec3 rotateY(vec3 v, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z);
  }

  void main() {
    // The quad may grow past the poster (uBleed) so a blurred edge has room; UVs keep the image size.
    vec2 grow = 1.0 + uBleed;
    vUv = (uv - 0.5) * grow + 0.5;

    // PlaneGeometry spans [-1, 1] with +y up; pitch grows downward.
    float yaw = uCard.x + position.x * grow.x * uCard.z;
    float pitch = uCard.y + uShift - position.y * grow.y * uCard.w;
    vec3 world = vec3(cos(pitch) * sin(yaw), -sin(pitch), -cos(pitch) * cos(yaw));
    vec3 view = rotateY(world, uCameraYaw);

    float theta = acos(clamp(-view.z, -1.0, 1.0));
    float planar = length(view.xy);
    vec2 direction = planar > 1e-6 ? view.xy / planar : vec2(0.0);
    float radius = tan(min(theta * uStrength, 1.55)) / uStrength;

    gl_Position = vec4(direction * radius * uScreen.xy + uScreen.zw, 0.0, 1.0);
  }
`;

export const FRAGMENT_SHADER = /* glsl */ `
  uniform vec4 uCard;          // shared with the vertex stage: z / w is the poster's aspect
  uniform sampler2D uMap;
  uniform float uHasMap;
  uniform float uMapAspect;    // source width / height
  uniform sampler2D uMapPrevious;  // crossfade source (banner change, first image load)
  uniform float uHasPrevious;
  uniform float uPreviousAspect;
  uniform float uBlend;        // 0 = previous, 1 = current
  uniform vec3 uPlaceholder;
  uniform float uDissolve;     // 0 = solid; 1 = gone (feed switch: fade out + blur)
  uniform float uDim;          // 0 = full brightness, 1 = fully veiled
  uniform vec3 uDimColor;
  uniform float uHighlight;    // hover / focus ring strength
  uniform vec3 uHighlightColor;
  uniform vec2 uBox;           // poster size at the gaze, px (rounded-corner metrics)
  uniform float uRadius;       // px
  uniform float uRingWidth;    // px
  uniform float uEdgeBlur;     // px; soft edge while dissolving

  varying vec2 vUv;

  // object-fit: cover for the poster's current shape (cards 16:9, banners wider).
  vec2 cover(float sourceAspect) {
    float target = uCard.z / max(uCard.w, 1e-6);
    vec2 scale = sourceAspect > target ? vec2(target / sourceAspect, 1.0) : vec2(1.0, sourceAspect / target);
    return vUv * scale + (1.0 - scale) * 0.5;
  }

  float roundedBox(vec2 p, vec2 halfSize, float r) {
    vec2 q = abs(p) - halfSize + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // Blur by sampling coarser mip levels as the poster dissolves.
    float blur = uDissolve * 6.0;
    vec3 current = uHasMap > 0.5 ? texture2D(uMap, cover(uMapAspect), blur).rgb : uPlaceholder;
    vec3 previous = uHasPrevious > 0.5 ? texture2D(uMapPrevious, cover(uPreviousAspect), blur).rgb : uPlaceholder;
    vec3 base = mix(previous, current, uBlend);
    vec3 color = mix(base, uDimColor, uDim);

    float edge = roundedBox((vUv - 0.5) * uBox, uBox * 0.5, uRadius);
    float aa = max(fwidth(edge), 1e-3);
    float soft = aa + uEdgeBlur;
    float alpha = 1.0 - smoothstep(-soft, soft, edge);
    float ring = smoothstep(-uRingWidth - aa, -uRingWidth + aa, edge);
    color = mix(color, uHighlightColor, ring * uHighlight);

    gl_FragColor = vec4(color, alpha * (1.0 - uDissolve));
  }
`;
