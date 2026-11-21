"use client";

import { useEffect, useRef } from "react";

/**
 * The site's backdrop: fiber-optic light. Fine glowing strands in the
 * site's clay, with a cool mist edge, drawn by one fragment shader into a
 * fixed full-screen layer behind every section. Light travels along the
 * fibers as moving pulses, with a few sparkles, and the whole field changes
 * shape as the page scrolls:
 *
 *   top      a radiant burst: strands fanning out from one bright focal
 *            point, which leans toward the pointer; they ignite on load,
 *            sweeping in from the far end
 *   middle   aurora curtains: soft vertical strands drifting slowly
 *   bottom   flowing threads: long horizontal strands (the contact section)
 *
 * Drawn at a reduced resolution, fewer strands on small screens, only while
 * the tab is visible. Reduced motion gets one settled frame that still
 * follows the scroll. Without WebGL, a CSS glow stands in.
 */

const VERTEX = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAGMENT = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_intro;
uniform float u_mode;    // 0 burst .. 1 curtains .. 2 threads
uniform float u_count;   // strands to draw
uniform vec2 u_pointer;  // -1..1

const int MAX_STRANDS = 48;

float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// A fiber's light at distance d: a bright thin core and a soft halo.
float fiber(float d, float width) {
  float core = width / (d + width * 0.6);
  float halo = 0.06 * width * 12.0 / (d * 18.0 + width * 12.0);
  return core * core + halo;
}

// Light travelling along a fiber, s being the position along it.
float travel(float s, float speed, float seed) {
  float x = fract(s * 0.55 - u_time * speed + seed) - 0.5;
  return 0.55 + 1.6 * exp(-x * x * 180.0);
}

vec3 burst(vec2 uv, float aspect) {
  vec3 clay = vec3(0.878, 0.541, 0.384);
  vec3 ember = vec3(1.0, 0.82, 0.66);
  vec3 mist = vec3(0.56, 0.68, 0.92);
  vec3 col = vec3(0.0);
  // Wide screens: between the headline and the hero card, so the fan opens
  // behind the card. Portrait (phones): low on the right edge, so the light
  // frames the text instead of crossing it.
  float portrait = 1.0 - smoothstep(0.7, 1.1, aspect);
  vec2 focus = vec2(aspect * (mix(0.52, 0.90, portrait) + 0.025 * u_pointer.x), mix(0.44, 0.26, portrait) + 0.035 * u_pointer.y);
  float reach = mix(aspect * 1.5, -0.15, u_intro);
  for (int i = 0; i < MAX_STRANDS; i++) {
    float fi = float(i);
    if (fi >= u_count) break;
    float r1 = hash(fi + 1.0), r2 = hash(fi * 3.7 + 2.0), r3 = hash(fi * 7.1 + 5.0);
    vec2 p = uv - focus;
    float a = -0.38 + 0.07 * sin(u_time * 0.06 + r3 * 6.0) + 0.04 * u_pointer.y;
    p = mat2(cos(a), -sin(a), sin(a), cos(a)) * p;
    float k = mix(0.35, 7.5, r1 * r1) * (1.0 + 0.12 * sin(u_time * 0.18 + fi));
    float wave = 0.014 * sin(p.y * 6.0 + u_time * (0.3 + r3 * 0.35) + fi * 1.7);
    float dx = p.x - (k * p.y * p.y + wave - 0.02 * r2);
    float slope = 2.0 * k * p.y;
    float d = abs(dx) / sqrt(1.0 + slope * slope);
    float g = fiber(d, 0.0009 + 0.0026 * r3);
    float side = smoothstep(-0.03, 0.12, p.x);
    float near = exp(-length(p) * 2.0);
    // Lit beyond the ignition front, which sweeps in from the far end to the focal point.
    float lit = smoothstep(reach - 0.3, reach, length(p) * 1.1);
    float flow = travel(abs(p.y) + p.x, 0.10 + 0.12 * r1, r2);
    vec3 tint = mix(mix(clay, mist, smoothstep(0.6, 1.0, r2)), ember, near * 0.5);
    col += tint * g * side * lit * flow * (0.30 + 1.5 * near) * (0.5 + 0.5 * r2);
  }
  return col * mix(1.0, 0.8, portrait);
}

vec3 curtains(vec2 uv, float aspect) {
  vec3 clay = vec3(0.86, 0.52, 0.37);
  vec3 mist = vec3(0.50, 0.63, 0.88);
  vec3 col = vec3(0.0);
  for (int i = 0; i < MAX_STRANDS; i++) {
    float fi = float(i);
    if (fi >= u_count) break;
    float r1 = hash(fi + 11.0), r2 = hash(fi * 2.3 + 7.0), r3 = hash(fi * 5.9 + 3.0);
    float base = aspect * mix(0.05, 0.95, r1);
    float x = base
      + 0.10 * sin(uv.y * (1.1 + r2) + u_time * (0.05 + 0.06 * r3) + fi)
      + 0.035 * sin(uv.y * (3.2 + 2.0 * r3) - u_time * 0.11 + fi * 2.3);
    float d = abs(uv.x - x);
    float g = fiber(d, 0.0008 + 0.0022 * r3);
    float veil = 0.012 / (d + 0.05);
    float flow = travel(uv.y, 0.05 + 0.06 * r1, r3);
    float band = smoothstep(0.0, 0.5, uv.y) * (1.0 - smoothstep(0.35, 1.05, uv.y));
    vec3 tint = mix(clay, mist, smoothstep(0.45, 0.95, r2));
    col += tint * (g * flow + veil * 0.10) * band * (0.25 + 0.4 * r2);
  }
  return col * 0.7;
}

vec3 threads(vec2 uv, float aspect) {
  vec3 clay = vec3(0.88, 0.55, 0.39);
  vec3 mist = vec3(0.55, 0.69, 0.93);
  vec3 col = vec3(0.0);
  for (int i = 0; i < MAX_STRANDS; i++) {
    float fi = float(i);
    if (fi >= u_count) break;
    float r1 = hash(fi + 21.0), r2 = hash(fi * 4.1 + 9.0), r3 = hash(fi * 6.7 + 1.0);
    float base = mix(0.12, 0.82, r1);
    float y = base
      + 0.08 * sin(uv.x * (0.8 + r2) + u_time * (0.09 + 0.10 * r3) + fi)
      + 0.025 * sin(uv.x * (3.0 + 2.0 * r3) - u_time * 0.2 + fi * 2.1);
    float d = abs(uv.y - y);
    float g = fiber(d, 0.0009 + 0.0024 * r3);
    float flow = travel(uv.x, 0.07 + 0.09 * r1, r2);
    float fade = smoothstep(0.0, 0.3, uv.x / aspect) * (1.0 - smoothstep(0.6, 1.0, uv.x / aspect));
    vec3 tint = mix(clay, mist, smoothstep(0.5, 1.0, r2));
    col += tint * g * flow * (0.3 + 0.55 * fade) * (0.45 + 0.55 * r2);
  }
  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.y;
  float aspect = u_res.x / u_res.y;
  vec3 col;
  if (u_mode <= 0.0) col = burst(uv, aspect);
  else if (u_mode < 1.0) col = mix(burst(uv, aspect), curtains(uv, aspect), u_mode);
  else if (u_mode == 1.0) col = curtains(uv, aspect);
  else if (u_mode < 2.0) col = mix(curtains(uv, aspect), threads(uv, aspect), u_mode - 1.0);
  else col = threads(uv, aspect);

  // Sparkles: a few tiny points that twinkle where there is light.
  vec2 cell = floor(gl_FragCoord.xy / 3.0);
  float star = step(0.9975, hash2(cell));
  float twinkle = 0.5 + 0.5 * sin(u_time * (1.0 + 3.0 * hash2(cell + 7.0)) + hash2(cell) * 40.0);
  col += vec3(1.0, 0.86, 0.76) * star * twinkle * min(1.0, dot(col, vec3(0.6))) * 1.6;

  col = 1.0 - exp(-col * 1.1);
  // On the site's deepest navy (#0a1226), which shows before the light ignites.
  gl_FragColor = vec4(vec3(0.039, 0.071, 0.149) + col * u_intro, 1.0);
}
`;

/** Canvas pixels per CSS pixel: soft light needs few, and it keeps the GPU cool. */
const RESOLUTION = 0.6;
const INTRO_MS = 1600;

/** Page progress (0-1) to field shape: burst on top, curtains, threads at the bottom. */
function modeAt(progress: number) {
  const smooth = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  return smooth(0.03, 0.22, progress) + smooth(0.78, 0.97, progress);
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export function LightField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const started = performance.now();
    let mode = 0;
    let frame = 0;
    // Set up again whenever the browser gives the GPU context back.
    let gl: WebGLRenderingContext | null = null;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};

    const setup = () => {
      const context = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
      if (!context || context.isContextLost()) return false;
      const vs = compile(context, context.VERTEX_SHADER, VERTEX);
      const fs = compile(context, context.FRAGMENT_SHADER, FRAGMENT);
      const program = context.createProgram();
      if (!vs || !fs || !program) return false;
      context.attachShader(program, vs);
      context.attachShader(program, fs);
      context.linkProgram(program);
      if (!context.getProgramParameter(program, context.LINK_STATUS)) return false;
      context.useProgram(program);
      context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
      context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), context.STATIC_DRAW);
      const position = context.getAttribLocation(program, "p");
      context.enableVertexAttribArray(position);
      context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
      uniforms = Object.fromEntries(
        ["u_res", "u_time", "u_intro", "u_mode", "u_count", "u_pointer"].map((name) => [name, context.getUniformLocation(program, name)]),
      );
      gl = context;
      return true;
    };

    const resize = () => {
      if (!gl) return;
      const width = innerWidth;
      const height = innerHeight;
      canvas.width = Math.max(1, Math.round(width * RESOLUTION));
      canvas.height = Math.max(1, Math.round(height * RESOLUTION));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.u_res, canvas.width, canvas.height);
      // Fewer strands where the screen (and usually the GPU) is small.
      gl.uniform1f(uniforms.u_count, width < 640 ? 24 : width < 1100 ? 36 : 46);
    };

    const progress = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    };

    const draw = (now: number) => {
      if (!gl) return;
      const elapsed = now - started;
      const intro = reduce ? 1 : Math.min(1, elapsed / INTRO_MS);
      const target = modeAt(progress());
      mode = reduce ? target : mode + (target - mode) * 0.06;
      if (Math.abs(target - mode) < 0.001) mode = target;
      pointer.x += (pointer.tx - pointer.x) * 0.035;
      pointer.y += (pointer.ty - pointer.y) * 0.035;
      gl.uniform1f(uniforms.u_time, reduce ? 14 : elapsed / 1000);
      gl.uniform1f(uniforms.u_intro, 1 - Math.pow(1 - intro, 3));
      gl.uniform1f(uniforms.u_mode, mode);
      gl.uniform2f(uniforms.u_pointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw(now);
      if (gl && !document.hidden && !reduce) frame = requestAnimationFrame(loop);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(loop);
    };
    const begin = () => {
      if (!setup()) return;
      resize();
      start();
      if (reduce) requestAnimationFrame(draw);
      canvas.dataset.ready = "";
    };

    // The GPU can take the context away (driver reset, too many pages):
    // show the CSS glow meanwhile, and draw again once it's given back.
    const onLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      gl = null;
      delete canvas.dataset.ready;
    };
    const onRestored = () => begin();
    const onResize = () => {
      resize();
      if (reduce) requestAnimationFrame(draw);
    };
    const onScroll = () => {
      if (reduce) requestAnimationFrame(draw);
    };
    const onVisibility = () => {
      if (!document.hidden && gl) start();
    };
    const onPointer = (event: PointerEvent) => {
      pointer.tx = (event.clientX / innerWidth) * 2 - 1;
      pointer.ty = -((event.clientY / innerHeight) * 2 - 1);
    };

    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    addEventListener("resize", onResize);
    addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduce) addEventListener("pointermove", onPointer, { passive: true });
    begin();

    // The context stays with the canvas: losing it on purpose here would
    // leave a remount (React may run effects twice) with a dead one.
    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      removeEventListener("resize", onResize);
      removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div aria-hidden="true" className="light-field pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* The glow without WebGL, and under the first frames. */}
      <div className="light-fallback absolute inset-0" />
      <canvas ref={canvasRef} className="light-canvas absolute inset-0 size-full" />
      {/* Keeps text readable: deepens the edges and the reading column's background. */}
      <div className="light-vignette absolute inset-0" />
    </div>
  );
}
