/**
 * Live point field.
 *
 * The ambient layer that sits behind the hero once the boot sequence has
 * finished. A jittered lattice of points that drifts on its own and gets
 * pushed around by the pointer, near the cursor points scatter outward and
 * light up, and they spring back when it leaves.
 *
 * Same approach as the boot renderer: one WebGL2 draw call, one buffer, one
 * shader, no library. The physics runs on the GPU, the CPU only uploads a
 * pointer position and a clock, so this costs about the same whether there are
 * 2,000 points or 12,000.
 *
 * Stops entirely when scrolled out of view, when the tab is hidden, and under
 * prefers-reduced-motion.
 */

const VERT = /* glsl */ `#version 300 es
precision highp float;

in vec2  aHome;   // lattice position, design space
in float aSeed;   // 0..1 per-point randomness

uniform vec2  uPointer;  // design space; far off-screen when absent
uniform float uTime;
uniform float uAspect;
uniform float uDpr;
uniform float uScale;
uniform float uIntro;    // 0..1 entry animation
uniform float uRadius;   // pointer influence radius

out vec3  vColor;
out float vAlpha;

const vec3 C_BASE   = vec3(0.30, 0.34, 0.62);
const vec3 C_CYAN   = vec3(0.16, 1.10, 1.45);
const vec3 C_INDIGO = vec3(0.52, 0.46, 1.55);

void main() {
  vec2 p = aHome;

  /* Slow independent drift. Two frequencies per axis so the field never
     settles into a visible rhythm. */
  float t = uTime * 0.28 + aSeed * 62.8;
  p += vec2(sin(t) * 0.5 + sin(t * 1.7) * 0.5,
            cos(t * 0.86) * 0.5 + cos(t * 1.4) * 0.5) * 0.02;

  /* Pointer displacement. The falloff is quadratic so the effect has a soft
     edge instead of a visible circular boundary. */
  vec2 away = p - uPointer;
  float d = length(away);
  float infl = 1.0 - smoothstep(0.0, uRadius, d);
  infl *= infl;
  p += normalize(away + vec2(0.0001)) * infl * uRadius * 0.42;

  /* Entry: the lattice arrives from the centre outward. */
  p *= mix(0.82, 1.0, uIntro);

  gl_Position = vec4(p.x / uAspect, p.y, 0.0, 1.0);

  float size = mix(1.3, 3.0, pow(aSeed, 2.0));
  size += infl * 3.2;                       // swell under the cursor
  gl_PointSize = size * uScale * uDpr;

  /* Colour ramps left-to-right across the field, then warms toward white
     wherever the pointer is pushing. */
  vec3 c = mix(C_BASE, C_INDIGO, smoothstep(-1.0, 1.0, aHome.x));
  c = mix(c, C_CYAN, infl * 0.85);
  c += vec3(0.9) * infl * infl;

  vColor = c;
  vAlpha = uIntro * mix(0.30, 0.80, aSeed) * (0.55 + infl * 0.85);
}
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec3 vColor;
in float vAlpha;
out vec4 outColor;

void main() {
  float d = length(gl_PointCoord - vec2(0.5)) * 2.0;
  float halo = pow(clamp(1.0 - d, 0.0, 1.0), 2.4);
  float core = pow(clamp(1.0 - d * 2.2, 0.0, 1.0), 1.5);
  float a = halo * 0.5 + core;
  outColor = vec4(vColor * a * vAlpha, a * vAlpha * 0.85);
}
`;

export interface FieldHandle {
  destroy(): void;
}

export function runField(canvas: HTMLCanvasElement): FieldHandle | null {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
    powerPreference: "low-power", // ambient, not the main event
  });
  if (!gl) return null;

  /* Bail on software rasterisers.
     SwiftShader / llvmpipe / Mesa mean WebGL is being emulated on the CPU.
     Usually a VM, a locked-down corporate machine, or a browser that has
     blocklisted the GPU. The field will "work" there and starve the main
     thread doing it, which stalls CSS transitions elsewhere on the page.
     The bloom lighting alone is a perfectly good fallback. */
  try {
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : "";
    if (/swiftshader|llvmpipe|software|mesa offscreen/i.test(renderer)) {
      return null;
    }
  } catch {
    /* Extension unavailable, some browsers hide it for fingerprinting
       reasons. Carry on; those are real GPUs often enough. */
  }

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("[field] shader failed:", gl.getShaderInfoLog(s));
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
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const u = {
    pointer: gl.getUniformLocation(prog, "uPointer"),
    time: gl.getUniformLocation(prog, "uTime"),
    aspect: gl.getUniformLocation(prog, "uAspect"),
    dpr: gl.getUniformLocation(prog, "uDpr"),
    scale: gl.getUniformLocation(prog, "uScale"),
    intro: gl.getUniformLocation(prog, "uIntro"),
    radius: gl.getUniformLocation(prog, "uRadius"),
  };

  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);

  let homeBuf = gl.createBuffer()!;
  let seedBuf = gl.createBuffer()!;
  let count = 0;
  let aspect = 1;
  let dpr = 1;
  let scale = 1;

  /** Rebuilds the lattice for the current size. */
  function build() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    aspect = Math.max(0.4, w / h);
    scale = Math.min(1.5, Math.max(0.7, Math.min(w, h * 1.6) / 900));

    /* Roughly one point per 46x46 CSS pixels, capped so a 5K display does not
       quietly ask for 40,000 points. */
    const cols = Math.min(90, Math.max(18, Math.round(w / 46)));
    const rows = Math.min(60, Math.max(12, Math.round(h / 46)));
    count = cols * rows;

    const home = new Float32Array(count * 2);
    const seeds = new Float32Array(count);

    let i = 0;
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        /* Jitter each point off its cell centre. A perfect grid reads as a
           texture; a jittered one reads as data. */
        const jx = (Math.random() - 0.5) * 0.9;
        const jy = (Math.random() - 0.5) * 0.9;
        home[i * 2] = ((x + 0.5 + jx) / cols - 0.5) * 2 * aspect;
        home[i * 2 + 1] = ((y + 0.5 + jy) / rows - 0.5) * 2;
        seeds[i] = Math.random();
        i += 1;
      }
    }

    gl!.bindBuffer(gl!.ARRAY_BUFFER, homeBuf);
    gl!.bufferData(gl!.ARRAY_BUFFER, home, gl!.STATIC_DRAW);
    const locHome = gl!.getAttribLocation(prog, "aHome");
    gl!.enableVertexAttribArray(locHome);
    gl!.vertexAttribPointer(locHome, 2, gl!.FLOAT, false, 0, 0);

    gl!.bindBuffer(gl!.ARRAY_BUFFER, seedBuf);
    gl!.bufferData(gl!.ARRAY_BUFFER, seeds, gl!.STATIC_DRAW);
    const locSeed = gl!.getAttribLocation(prog, "aSeed");
    gl!.enableVertexAttribArray(locSeed);
    gl!.vertexAttribPointer(locSeed, 1, gl!.FLOAT, false, 0, 0);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round((canvas.clientWidth || 1) * dpr);
    canvas.height = Math.round((canvas.clientHeight || 1) * dpr);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    build();
  }

  resize();

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.clearColor(0, 0, 0, 0);

  /* Pointer, in design space. Kept far away when absent so the influence term
     is exactly zero rather than nearly zero. */
  const target = { x: -99, y: -99 };
  const eased = { x: -99, y: -99 };

  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    target.x = ((e.clientX - r.left) / r.width - 0.5) * 2 * aspect;
    target.y = -((e.clientY - r.top) / r.height - 0.5) * 2;
    if (eased.x < -50) {
      eased.x = target.x;
      eased.y = target.y;
    }
  };
  const onLeave = () => {
    target.x = -99;
    target.y = -99;
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerleave", onLeave, { passive: true });

  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 150);
  };
  window.addEventListener("resize", onResize);

  /* Pause when off-screen or in a hidden tab. An ambient background animating
     behind three sections of scrolled-past content is pure heat. */
  let onScreen = true;
  const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), {
    rootMargin: "80px",
  });
  io.observe(canvas);

  const onVis = () => {
    if (!document.hidden) last = 0;
  };
  document.addEventListener("visibilitychange", onVis);

  let raf = 0;
  let start = 0;
  let last = 0;

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (!onScreen || document.hidden) return;
    /* ~40fps. This is a background; the difference from 60 is invisible and
       the saving is not. */
    if (last && now - last < 25) return;
    last = now;
    if (!start) start = now;

    const t = (now - start) / 1000;

    /* Ease the pointer rather than tracking it exactly, the lag is what makes
       the field feel like it has mass. */
    if (target.x < -50) {
      eased.x = -99;
      eased.y = -99;
    } else {
      eased.x += (target.x - eased.x) * 0.12;
      eased.y += (target.y - eased.y) * 0.12;
    }

    gl!.uniform2f(u.pointer, eased.x, eased.y);
    gl!.uniform1f(u.time, t);
    gl!.uniform1f(u.aspect, aspect);
    gl!.uniform1f(u.dpr, dpr);
    gl!.uniform1f(u.scale, scale);
    gl!.uniform1f(u.intro, Math.min(1, t / 1.4));
    gl!.uniform1f(u.radius, 0.42);

    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.drawArrays(gl!.POINTS, 0, count);
  }

  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      gl!.deleteBuffer(homeBuf);
      gl!.deleteBuffer(seedBuf);
      gl!.deleteVertexArray(vao);
      gl!.deleteProgram(prog);
      gl!.deleteShader(vs!);
      gl!.deleteShader(fs!);
    },
  };
}
