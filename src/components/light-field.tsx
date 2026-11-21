"use client";

import { useEffect, useRef } from "react";

/**
 * The site's backdrop: a living particle galaxy. Tens of thousands of points
 * of light, in the site's palette (an ember-white core, clay arms, a cool
 * mist rim), drawn on the GPU in one call per frame and placed entirely by
 * the vertex shader, so there's no simulation on the CPU.
 *
 * - Load: the points swirl in from a scattered field and gather into a
 *   spiral galaxy behind the hero card.
 * - Always: inner stars orbit faster than outer ones; a soft twinkle; the
 *   galaxy leans toward the pointer, and points part around it like a hand
 *   moving through stardust.
 * - Scroll: the galaxy turns into a breathing sphere of points through the
 *   middle of the page, then a flowing wave field at Contact.
 *
 * Fewer points on small screens, paused while the tab is hidden, rebuilt if
 * the GPU drops the context. Reduced motion gets one settled frame that still
 * follows the scroll. Without WebGL, a CSS glow stands in.
 */

const VERTEX = `
attribute vec4 a_seed;
uniform float u_time;
uniform float u_intro;
uniform float u_mode;    // 0 galaxy .. 1 sphere .. 2 waves
uniform float u_aspect;
uniform float u_size;
uniform float u_portrait;
uniform vec2 u_pointer;  // NDC
varying vec3 v_color;
varying float v_alpha;

const float TAU = 6.2831853;

vec3 galaxy(vec4 s) {
  float r = pow(s.x, 1.8) * 1.3 + 0.03;
  float arm = floor(s.y * 3.0);
  float jitter = (s.z - 0.5) * (0.28 + r * 0.55);
  float angle = arm * TAU / 3.0 + r * 3.4 + jitter + u_time * 0.10 / (0.25 + r);
  float height = (s.w - 0.5) * 0.10 * (1.2 - r * 0.6);
  return vec3(cos(angle) * r, height, sin(angle) * r);
}

vec3 sphere(vec4 s) {
  float theta = s.x * TAU + u_time * 0.06;
  float phi = acos(2.0 * s.y - 1.0);
  float radius = 0.92 + 0.07 * sin(u_time * 0.7 + s.z * 14.0 + phi * 3.0) + (s.w - 0.5) * 0.04;
  return vec3(sin(phi) * cos(theta), cos(phi), sin(phi) * sin(theta)) * radius;
}

vec3 waves(vec4 s) {
  // A wide sea of stardust running past the screen's edges, low in view.
  float x = (s.x - 0.5) * 10.0;
  float z = (s.y - 0.82) * 6.0;
  float y = 0.18 * sin(x * 1.1 + u_time * 0.5) * cos(z * 1.4 + u_time * 0.3)
          + 0.07 * sin(x * 2.6 - u_time * 0.4 + z * 1.2);
  return vec3(x, y - 0.85, z);
}

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }

void main() {
  vec4 s = a_seed;
  float toSphere = clamp(u_mode, 0.0, 1.0);
  float toWaves = clamp(u_mode - 1.0, 0.0, 1.0);
  vec3 form = mix(mix(galaxy(s), sphere(s), toSphere), waves(s), toWaves);

  // Intro: each point flies in from a scattered field, a little staggered.
  float t = clamp(u_intro * 1.4 - s.w * 0.4, 0.0, 1.0);
  float ease = 1.0 - (1.0 - t) * (1.0 - t) * (1.0 - t);
  vec3 scatter = (s.xyz - 0.5) * vec3(9.0, 6.0, 7.0);
  vec3 p = mix(scatter, form, ease);

  // Camera: the galaxy seen at an angle, the sphere and the waves more level.
  float tilt = mix(mix(0.92, 0.30, toSphere), 0.42, toWaves) + u_pointer.y * 0.12;
  float turn = u_time * 0.035 + u_pointer.x * 0.25;
  p = rotX(tilt) * rotY(turn) * p;
  float depth = p.z + 3.1;
  vec2 proj = p.xy * mix(2.7, 2.1, max(toSphere, toWaves)) / depth;

  // Where it sits: the galaxy behind the hero card (low and right on phones),
  // the sphere and waves centred.
  vec2 galaxyAt = mix(vec2(0.40, 0.0), vec2(0.62, -0.70), u_portrait);
  vec2 at = mix(galaxyAt, vec2(0.0, -0.05), max(toSphere, toWaves));
  float scale = mix(1.0, 0.72, u_portrait);
  vec2 ndc = vec2(proj.x * scale / u_aspect, proj.y * scale) + at;

  // Points part around the pointer.
  vec2 d = ndc - u_pointer;
  d.x *= u_aspect;
  float push = exp(-dot(d, d) * 18.0) * 0.06;
  ndc += normalize(d + vec2(0.0001)) * push * vec2(1.0 / u_aspect, 1.0);

  gl_Position = vec4(ndc, 0.0, 1.0);
  gl_PointSize = u_size * (0.8 + s.w * 1.8) * (3.1 / depth);

  // Colour by distance from the centre: ember core, clay, mist rim.
  float rr = length(form.xz) * (1.0 - toSphere) * (1.0 - toWaves) + (1.0 - abs(form.y)) * 0.6 * toSphere + s.x * toWaves;
  vec3 ember = vec3(1.0, 0.86, 0.72);
  vec3 clay = vec3(0.88, 0.54, 0.38);
  vec3 mist = vec3(0.55, 0.68, 0.94);
  vec3 col = mix(ember, clay, smoothstep(0.02, 0.45, rr));
  col = mix(col, mist, smoothstep(0.55, 1.15, rr) * 0.85 + step(0.93, s.z) * 0.5);
  float twinkle = 0.65 + 0.35 * sin(u_time * (1.2 + s.y * 2.5) + s.z * 40.0);
  // The galaxy's core: bigger, softer points that pool into a glow.
  float core = (1.0 - smoothstep(0.0, 0.32, rr)) * (1.0 - toSphere) * (1.0 - toWaves);
  gl_PointSize *= 1.0 + mix(2.6, 1.2, u_portrait) * core;
  v_color = col;
  // Phones pack the same galaxy into less room: dimmer, so it never blows out.
  v_alpha = (0.40 + 0.55 * s.w) * twinkle * mix(0.35, 1.0, ease) * (1.0 - 0.45 * core) * mix(1.0, 0.5, u_portrait);
}
`;

const FRAGMENT = `
precision mediump float;
varying vec3 v_color;
varying float v_alpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = 1.0 - smoothstep(0.0, 0.5, d);
  gl_FragColor = vec4(v_color * a * a * v_alpha, 1.0);
}
`;

const INTRO_MS = 2600;
const NAVY = [0.039, 0.071, 0.149] as const; // #0a1226

/** Page progress (0-1) to formation: galaxy on top, sphere, waves at the bottom. */
function modeAt(progress: number) {
  const smooth = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  return smooth(0.04, 0.24, progress) + smooth(0.76, 0.96, progress);
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

/** Deterministic seeds, so every load draws the same galaxy. */
function seeds(count: number) {
  const data = new Float32Array(count * 4);
  let state = 1234567;
  for (let i = 0; i < data.length; i++) {
    state = (state * 1664525 + 1013904223) >>> 0;
    data[i] = state / 4294967296;
  }
  return data;
}

export function LightField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 2, y: 2, tx: 2, ty: 2 }; // off screen until the pointer moves
    const started = performance.now();
    let mode = 0;
    let frame = 0;
    let count = 0;
    let gl: WebGLRenderingContext | null = null;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};

    const setup = () => {
      const context = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "high-performance" });
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

      // Fewer points where the screen (and usually the GPU) is small.
      count = innerWidth < 640 ? 26000 : innerWidth < 1100 ? 46000 : 72000;
      context.bindBuffer(context.ARRAY_BUFFER, context.createBuffer());
      context.bufferData(context.ARRAY_BUFFER, seeds(count), context.STATIC_DRAW);
      const seed = context.getAttribLocation(program, "a_seed");
      context.enableVertexAttribArray(seed);
      context.vertexAttribPointer(seed, 4, context.FLOAT, false, 0, 0);

      context.disable(context.DEPTH_TEST);
      context.enable(context.BLEND);
      context.blendFunc(context.ONE, context.ONE); // light adds up
      context.clearColor(NAVY[0], NAVY[1], NAVY[2], 1);

      uniforms = Object.fromEntries(
        ["u_time", "u_intro", "u_mode", "u_aspect", "u_size", "u_portrait", "u_pointer"].map((name) => [
          name,
          context.getUniformLocation(program, name),
        ]),
      );
      gl = context;
      return true;
    };

    const resize = () => {
      if (!gl) return;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(innerWidth * dpr));
      canvas.height = Math.max(1, Math.round(innerHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const aspect = innerWidth / innerHeight;
      gl.uniform1f(uniforms.u_aspect, aspect);
      gl.uniform1f(uniforms.u_portrait, aspect < 0.9 ? 1 : 0);
      gl.uniform1f(uniforms.u_size, 2.1 * dpr);
    };

    const progress = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    };

    const draw = (now: number) => {
      if (!gl) return;
      const elapsed = now - started;
      const target = modeAt(progress());
      mode = reduce ? target : mode + (target - mode) * 0.05;
      if (Math.abs(target - mode) < 0.001) mode = target;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      gl.uniform1f(uniforms.u_time, reduce ? 20 : elapsed / 1000);
      gl.uniform1f(uniforms.u_intro, reduce ? 1 : Math.min(1, elapsed / INTRO_MS));
      gl.uniform1f(uniforms.u_mode, mode);
      gl.uniform2f(uniforms.u_pointer, pointer.x, pointer.y);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
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
    const onLeave = () => {
      pointer.tx = 2;
      pointer.ty = 2;
    };

    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    addEventListener("resize", onResize);
    addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduce) {
      addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
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
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="light-field pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* The glow without WebGL, and under the first frames. */}
      <div className="light-fallback absolute inset-0" />
      <canvas ref={canvasRef} className="light-canvas absolute inset-0 size-full" />
      {/* Keeps text readable: deepens the edges. */}
      <div className="light-vignette absolute inset-0" />
    </div>
  );
}
