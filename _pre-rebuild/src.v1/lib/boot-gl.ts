/**
 * Boot sequence renderer.
 *
 * A single WebGL2 point cloud that plays out the argument the site makes,
 * before the site says a word:
 *
 *   ignite   a single point of light
 *   scatter  it bursts into unstructured noise — raw behaviour, no model
 *   sort     the noise separates into two labelled clusters
 *   decide   a boundary sweeps between them
 *   resolve  everything collapses into the wordmark
 *
 * Roughly three and a half seconds, skippable at any point, and it runs once
 * per browser session rather than on every navigation.
 *
 * Why hand-written GL rather than three.js: this needs one draw call of one
 * buffer with one shader. Pulling in ~600KB of scene graph to do that would
 * cost more than the effect is worth, and the whole file is smaller than the
 * import would be.
 */

/* ==========================================================================
   Shaders
   ========================================================================== */

const VERT = /* glsl */ `#version 300 es
precision highp float;

/* Three target layouts per point. The animation is a weighted blend of the
   three, which means the whole timeline is three uniforms and no CPU work
   per particle per frame. */
in vec2  aNoise;
in vec2  aCluster;
in vec2  aText;
in float aSeed;    // 0..1, per-point randomness
in float aSide;    // 0 or 1 — which side of the decision boundary

uniform float uNoiseW;
uniform float uClusterW;
uniform float uTextW;
uniform float uTime;
uniform float uAspect;
uniform float uDpr;
uniform float uBurst;   // 0..1, collapses everything toward the origin
uniform float uSweep;   // x position of the decision boundary, or -99 when idle
uniform float uFade;    // global opacity
uniform float uScale;   // viewport-relative point scale

out vec3  vColor;
out float vAlpha;

/* Palette. Kept in sync with the --indigo / --cyan / --magenta / --lime
   tokens in globals.css. Deliberately over-driven past 1.0: under additive
   blending the overlapping halos are what produce a bright core, and values
   that stop at 1.0 give a flat, chalky cloud instead of light. */
const vec3 C_DIM     = vec3(0.62, 0.68, 1.15);
const vec3 C_CYAN    = vec3(0.20, 1.45, 1.75);
const vec3 C_MAGENTA = vec3(1.80, 0.32, 1.00);
const vec3 C_INDIGO  = vec3(0.70, 0.62, 1.90);
const vec3 C_LIME    = vec3(1.25, 1.85, 0.42);

void main() {
  /* --- position ------------------------------------------------------- */
  vec2 p = aNoise * uNoiseW + aCluster * uClusterW + aText * uTextW;

  /* Idle drift, so the cloud is never completely still. Phase-shifted per
     point by its seed or the whole field pulses in unison and looks cheap. */
  float t = uTime + aSeed * 62.8;
  p += vec2(sin(t * 0.7), cos(t * 0.55)) * 0.012 * (0.4 + aSeed);

  /* The burst: at t=0 every point sits at the origin, then flies out. */
  p *= uBurst;

  gl_Position = vec4(p.x / uAspect, p.y, 0.0, 1.0);

  /* --- size ------------------------------------------------------------ */
  /* A wide spread between the smallest and largest point is what stops the
     field looking like a texture. Most points are small; the few large ones
     carry the light. */
  float size = mix(2.2, 7.0, pow(aSeed, 1.8));
  size *= mix(1.0, 1.35, uTextW);        // wordmark points read denser
  size *= mix(1.6, 1.0, smoothstep(0.0, 1.0, uBurst)); // fat at ignition
  gl_PointSize = size * uScale * uDpr;

  /* --- colour ---------------------------------------------------------- */
  /* Unsorted noise is deliberately drab. The colour arrives with the
     structure, which is the entire point of the sequence. */
  vec3 sorted = mix(C_CYAN, C_MAGENTA, aSide);
  vec3 resolved = mix(C_INDIGO, C_LIME, smoothstep(-0.9, 0.9, aText.x));

  vec3 c = C_DIM;
  c = mix(c, sorted, uClusterW);
  c = mix(c, resolved, uTextW);

  /* --- the decision boundary -------------------------------------------
     A vertical band of brightness sweeping across x. Points light up as it
     passes them, which reads as the boundary being *drawn* through the data
     rather than composited over it. */
  float d = abs(p.x - uSweep);
  float hit = 1.0 - smoothstep(0.0, 0.18, d);
  c += vec3(2.4, 2.6, 3.0) * hit;
  gl_PointSize += hit * 6.0 * uScale * uDpr;

  vColor = c;
  vAlpha = uFade * mix(0.7, 1.0, aSeed);
}
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;

in vec3  vColor;
in float vAlpha;
out vec4 outColor;

void main() {
  /* Two-part sprite: a tight bright core inside a wide soft halo. A single
     falloff gives you either a hard dot or a smudge; layering them is what
     makes additive blending read as light rather than fog. */
  float d = length(gl_PointCoord - vec2(0.5)) * 2.0;

  float halo = pow(clamp(1.0 - d, 0.0, 1.0), 2.2);
  float core = pow(clamp(1.0 - d * 2.4, 0.0, 1.0), 1.4);
  float a = halo * 0.55 + core;

  outColor = vec4(vColor * a * vAlpha, a * vAlpha * 0.9);
}
`;

/* ==========================================================================
   Timeline
   --------------------------------------------------------------------------
   Seconds from start. Editing these is how you re-time the sequence; nothing
   downstream hard-codes a duration.
   ========================================================================== */

export const TIMELINE = {
  ignite: 0.0,
  scatter: 0.6, // burst out of the seed point
  sort: 1.3, // begin separating into clusters
  decide: 2.2, // boundary starts its sweep
  resolve: 2.55, // begin collapsing into the wordmark
  hold: 3.6, // wordmark fully formed, holds
  done: 4.2, // handed off to the page
} as const;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
/** Normalised progress through [a, b]. */
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/* ==========================================================================
   Geometry
   ========================================================================== */

/**
 * Samples the wordmark into a set of points.
 *
 * Renders the text to an offscreen canvas, walks the alpha channel, and keeps
 * a random subset of the covered pixels. Random rather than strided — a stride
 * lands on the pixel grid and leaves visible moiré lines through the letters.
 */
function sampleText(
  text: string,
  count: number,
  aspect: number,
): Float32Array<ArrayBuffer> {
  const W = 1024;
  const H = 256;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true });

  const out = new Float32Array(count * 2);
  if (!ctx) return out;

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  /* Shrink until it fits the canvas with margin. Fluid type means the
     wordmark width is not knowable ahead of time. */
  let size = 190;
  do {
    ctx.font = `700 ${size}px "Inter Tight", Inter, system-ui, sans-serif`;
    if (ctx.measureText(text).width <= W * 0.9) break;
    size -= 6;
  } while (size > 40);

  ctx.clearRect(0, 0, W, H);
  ctx.fillText(text, W / 2, H / 2);

  const data = ctx.getImageData(0, 0, W, H).data;

  /* Collect every covered pixel first, then draw from it. Rejection sampling
     directly into the output stalls badly when coverage is sparse. */
  const hits: number[] = [];
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      if (data[(y * W + x) * 4 + 3] > 128) hits.push(x, y);
    }
  }

  const n = hits.length / 2;
  if (!n) return out;

  /* Design space: y spans [-1, 1], x spans [-aspect, aspect]. The wordmark
     occupies a fixed fraction of the height so it scales with the viewport. */
  const scale = 0.34;
  for (let i = 0; i < count; i += 1) {
    const j = ((Math.random() * n) | 0) * 2;
    const px = hits[j] / W - 0.5;
    const py = hits[j + 1] / H - 0.5;
    out[i * 2] = px * (W / H) * scale * 2;
    out[i * 2 + 1] = -py * scale * 2;
  }
  return out;
}

/** Box–Muller. Uniform random in a disc looks like a disc; noise should not. */
function gaussian(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/* ==========================================================================
   Renderer
   ========================================================================== */

export interface BootHandle {
  /** Jump to the end and stop. Safe to call more than once. */
  skip(): void;
  destroy(): void;
}

export interface BootOptions {
  canvas: HTMLCanvasElement;
  wordmark: string;
  /** Fires once when the sequence finishes or is skipped. */
  onDone: () => void;
  /** Fires with 0..1 progress, for anything the DOM wants to sync to. */
  onProgress?: (t: number) => void;
}

export function runBoot(opts: BootOptions): BootHandle | null {
  const { canvas, wordmark, onDone, onProgress } = opts;

  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
    powerPreference: "high-performance",
  });

  /* No WebGL2 — an old browser, a blocked context, a stingy VM. The caller
     treats null as "skip the sequence" rather than showing a broken canvas. */
  if (!gl) return null;

  /* --- program ---------------------------------------------------------- */

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("[boot] shader failed:", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("[boot] link failed:", gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  const u = {
    noiseW: gl.getUniformLocation(prog, "uNoiseW"),
    clusterW: gl.getUniformLocation(prog, "uClusterW"),
    textW: gl.getUniformLocation(prog, "uTextW"),
    time: gl.getUniformLocation(prog, "uTime"),
    aspect: gl.getUniformLocation(prog, "uAspect"),
    dpr: gl.getUniformLocation(prog, "uDpr"),
    burst: gl.getUniformLocation(prog, "uBurst"),
    sweep: gl.getUniformLocation(prog, "uSweep"),
    fade: gl.getUniformLocation(prog, "uFade"),
    scale: gl.getUniformLocation(prog, "uScale"),
  };

  /* --- point count ------------------------------------------------------
     Scaled to the device. A phone does not need 9,000 points to read as a
     cloud, and will drop frames trying. */
  const COUNT = Math.min(
    9000,
    Math.max(2600, Math.round((window.innerWidth * window.innerHeight) / 190)),
  );

  const seeds = new Float32Array(COUNT);
  const sides = new Float32Array(COUNT);
  const noise = new Float32Array(COUNT * 2);
  const cluster = new Float32Array(COUNT * 2);
  let text = new Float32Array(COUNT * 2);

  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);

  const buffers: Record<string, WebGLBuffer> = {};
  const attach = (name: string, data: Float32Array, size: number) => {
    const b = gl.createBuffer()!;
    buffers[name] = b;
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    const loc = gl.getAttribLocation(prog, name);
    if (loc >= 0) {
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    }
  };

  let aspect = 1;

  /** Rebuilds every layout. Called on mount and on resize. */
  function buildGeometry() {
    aspect = Math.max(0.4, canvas.clientWidth / Math.max(1, canvas.clientHeight));

    for (let i = 0; i < COUNT; i += 1) {
      seeds[i] = Math.random();
      const side = Math.random() < 0.5 ? 0 : 1;
      sides[i] = side;

      /* Unstructured: a broad gaussian blob, no shape to read. */
      noise[i * 2] = gaussian() * 0.42 * aspect;
      noise[i * 2 + 1] = gaussian() * 0.42;

      /* Sorted: two tighter gaussians either side of x = 0, with a little
         vertical shear so it looks like data and not two dots. */
      const cx = (side === 0 ? -0.46 : 0.46) * aspect;
      cluster[i * 2] = cx + gaussian() * 0.15 * aspect;
      cluster[i * 2 + 1] = gaussian() * 0.3 + (side === 0 ? -0.06 : 0.06);
    }

    text = sampleText(wordmark, COUNT, aspect);
  }

  buildGeometry();

  attach("aNoise", noise, 2);
  attach("aCluster", cluster, 2);
  attach("aText", text, 2);
  attach("aSeed", seeds, 1);
  attach("aSide", sides, 1);

  /* --- sizing ----------------------------------------------------------- */

  let dpr = 1;
  /* Points are sized in CSS pixels against a 900px reference height, so the
     cloud has the same visual weight on a laptop and on a 27" display. */
  let scale = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    scale = Math.min(1.6, Math.max(0.72, Math.min(w, h * 1.6) / 900));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl!.viewport(0, 0, canvas.width, canvas.height);

    buildGeometry();
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffers.aNoise);
    gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, noise);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffers.aCluster);
    gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, cluster);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffers.aText);
    gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, text);
  }

  resize();

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 140);
  };
  window.addEventListener("resize", onResize);

  /* --- draw ------------------------------------------------------------- */

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // additive — light accumulates
  gl.clearColor(0, 0, 0, 0);

  let raf = 0;
  let start = 0;
  let finished = false;
  /* Set when skip() lands mid-flight, so the remaining frames race to the
     end state instead of cutting hard to it. */
  let skipFrom = -1;

  function finish() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(raf);
    onDone();
  }

  function frame(now: number) {
    if (!start) start = now;
    let t = (now - start) / 1000;

    if (skipFrom >= 0) {
      /* Compress whatever is left into 260ms. */
      const k = (t - skipFrom) / 0.26;
      t = skipFrom + (TIMELINE.done - skipFrom) * clamp01(k);
    }

    /* --- weights ------------------------------------------------------- */
    const toCluster = easeInOut(seg(t, TIMELINE.sort, TIMELINE.decide));
    const toText = easeInOut(seg(t, TIMELINE.resolve, TIMELINE.hold));

    const wText = toText;
    const wCluster = toCluster * (1 - toText);
    const wNoise = 1 - wCluster - wText;

    /* Burst out of the origin. */
    const burst = easeOut(seg(t, TIMELINE.ignite, TIMELINE.scatter));

    /* Boundary sweep: crosses the frame once, between sorting and resolving,
       then parks off-screen where the shader's distance test can't reach. */
    const sweeping = t >= TIMELINE.decide && t <= TIMELINE.resolve + 0.35;
    const sweep = sweeping
      ? (-1.2 + 2.4 * easeInOut(seg(t, TIMELINE.decide, TIMELINE.resolve + 0.35))) *
        aspect
      : -99;

    /* Fade in fast, hold, then hand off to the DOM hero underneath. */
    const fadeIn = clamp01(t / 0.28);
    const fadeOut = 1 - easeInOut(seg(t, TIMELINE.hold, TIMELINE.done));
    const fade = fadeIn * fadeOut;

    gl!.uniform1f(u.noiseW, wNoise);
    gl!.uniform1f(u.clusterW, wCluster);
    gl!.uniform1f(u.textW, wText);
    gl!.uniform1f(u.time, t);
    gl!.uniform1f(u.aspect, aspect);
    gl!.uniform1f(u.dpr, dpr);
    gl!.uniform1f(u.burst, burst);
    gl!.uniform1f(u.sweep, sweep);
    gl!.uniform1f(u.fade, fade);
    gl!.uniform1f(u.scale, scale);

    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.drawArrays(gl!.POINTS, 0, COUNT);

    onProgress?.(clamp01(t / TIMELINE.done));

    if (t >= TIMELINE.done) {
      finish();
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);

  return {
    skip() {
      if (finished || skipFrom >= 0) return;
      skipFrom = start ? (performance.now() - start) / 1000 : 0;
      /* Already past the interesting part — just end it. */
      if (skipFrom >= TIMELINE.hold) finish();
    },
    destroy() {
      finished = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      Object.values(buffers).forEach((b) => gl!.deleteBuffer(b));
      gl!.deleteVertexArray(vao);
      gl!.deleteProgram(prog);
      gl!.deleteShader(vs!);
      gl!.deleteShader(fs!);
    },
  };
}
