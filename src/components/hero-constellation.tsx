"use client";

import { useEffect, useRef } from "react";
import { Activity, Code, Database, Library, Link2, Plug, Workflow, Zap, type LucideIcon } from "lucide-react";

import { profile, projects } from "@/content/profile";

/**
 * The hero's picture of Pavan's work: his mark at the centre of the agent
 * stack he builds with, every part wired to it. Pulses run from the centre
 * to each part in turn and the part lights as its pulse lands -- the way an
 * orchestrator hands work to its tools. The glass card tilts toward the
 * pointer and floats. All labels are names used elsewhere on the site.
 */

const NODES: { label: string; icon: LucideIcon }[] = [
  { label: "Python", icon: Code },
  { label: "LangGraph", icon: Workflow },
  { label: "LangChain", icon: Link2 },
  { label: "MCP", icon: Plug },
  { label: "RAG", icon: Library },
  { label: "FastAPI", icon: Zap },
  { label: "PostgreSQL", icon: Database },
  { label: "LangSmith", icon: Activity },
];

// Drawing space: the hub in the middle, the parts on an ellipse around it.
const W = 520;
const H = 400;
const HUB = { x: W / 2, y: H / 2 };
const RX = 182;
const RY = 142;
/** One pulse cycle; the parts take their turns within it. */
const CYCLE = 4.2;

const PLACED = NODES.map((node, i) => {
  const angle = -Math.PI / 2 + (i / NODES.length) * Math.PI * 2 + Math.PI / NODES.length;
  const x = HUB.x + RX * Math.cos(angle);
  const y = HUB.y + RY * Math.sin(angle);
  // A gentle arc: the control point is pushed sideways off the straight line.
  const mx = (HUB.x + x) / 2;
  const my = (HUB.y + y) / 2;
  const nx = -(y - HUB.y);
  const ny = x - HUB.x;
  const len = Math.hypot(nx, ny) || 1;
  const bend = 26;
  const path = `M ${HUB.x} ${HUB.y} Q ${mx + (nx / len) * bend} ${my + (ny / len) * bend} ${x} ${y}`;
  return { ...node, x, y, path, delay: (i * CYCLE) / NODES.length };
});

/** The card leans toward the pointer (smoothed), within a few degrees. */
function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(pointer: fine)").matches) return;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let frame = 0;
    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      el.style.setProperty("--rx", `${current.y.toFixed(3)}deg`);
      el.style.setProperty("--ry", `${current.x.toFixed(3)}deg`);
      if (Math.abs(target.x - current.x) > 0.01 || Math.abs(target.y - current.y) > 0.01) frame = requestAnimationFrame(tick);
      else frame = 0;
    };
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / innerWidth;
      const dy = (event.clientY - (rect.top + rect.height / 2)) / innerHeight;
      target.x = Math.max(-1, Math.min(1, dx * 2)) * 7;
      target.y = Math.max(-1, Math.min(1, dy * 2)) * -6;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return ref;
}

export function HeroConstellation() {
  const tilt = useTilt<HTMLDivElement>();
  const featured = projects.map((p) => ({ id: p.id, name: p.name, tile: p.brand.tile }));

  return (
    <div className="constellation-stage">
      <div ref={tilt} className="constellation-tilt">
        <figure
          aria-label={`${profile.role}: ${NODES.map((n) => n.label).join(", ")}`}
          className="constellation-float glass relative overflow-hidden rounded-[28px]"
        >
          {/* Card header */}
          <div className="relative flex items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-3.5">
            <p className="flex items-center gap-2 text-[13px] text-hero-ink">
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-hero-accent/70 motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-hero-accent" />
              </span>
              {profile.role}
            </p>
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="size-2 rounded-full bg-white/15" />
              <span className="size-2 rounded-full bg-white/15" />
              <span className="size-2 rounded-full bg-hero-accent/70" />
            </span>
          </div>

          {/* The constellation */}
          <div className="relative aspect-[520/400]">
            <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
              <defs>
                <radialGradient id="hub-glow">
                  <stop offset="0%" stopColor="#e08a62" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#e08a62" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="node-glow">
                  <stop offset="0%" stopColor="#f0b190" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#e08a62" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="edge" gradientUnits="userSpaceOnUse" x1={HUB.x - RX} y1="0" x2={HUB.x + RX} y2="0">
                  <stop offset="0%" stopColor="#aab4c8" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#e08a62" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#aab4c8" stopOpacity="0.35" />
                </linearGradient>
              </defs>

              <circle cx={HUB.x} cy={HUB.y} r="120" fill="url(#hub-glow)" className="hub-breathe" />
              {/* Orbits turning slowly around the hub. */}
              <g className="orbit orbit-slow">
                <ellipse cx={HUB.x} cy={HUB.y} rx={RX} ry={RY} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeDasharray="2 7" />
              </g>
              <g className="orbit orbit-reverse">
                <circle cx={HUB.x} cy={HUB.y} r="74" fill="none" stroke="rgb(224 138 98 / 0.35)" strokeDasharray="1 9" strokeLinecap="round" />
                <circle cx={HUB.x + 74} cy={HUB.y} r="3" fill="#e08a62" />
              </g>

              {PLACED.map((node) => (
                <g key={node.label}>
                  <path d={node.path} pathLength={1} fill="none" stroke="url(#edge)" strokeWidth="1.25" className="edge-draw" />
                  {/* The part lights as its pulse arrives. */}
                  <circle cx={node.x} cy={node.y} r="46" fill="url(#node-glow)" opacity="0" className="pulse">
                    <animate
                      attributeName="opacity"
                      values="0;0;0.85;0"
                      keyTimes="0;0.36;0.42;1"
                      dur={`${CYCLE}s`}
                      begin={`${node.delay}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* The pulse: out along the wire, then gone. */}
                  <g className="pulse" opacity="0">
                    <circle r="9" fill="#e08a62" opacity="0.25" />
                    <circle r="3.6" fill="#ffd9c4" />
                    <animateMotion
                      path={node.path}
                      keyPoints="0;1;1"
                      keyTimes="0;0.4;1"
                      calcMode="spline"
                      keySplines="0.45 0 0.2 1;0 0 1 1"
                      dur={`${CYCLE}s`}
                      begin={`${node.delay}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0;0"
                      keyTimes="0;0.04;0.38;0.44;1"
                      dur={`${CYCLE}s`}
                      begin={`${node.delay}s`}
                      repeatCount="indefinite"
                    />
                  </g>
                </g>
              ))}
            </svg>

            {/* The hub: his mark. */}
            <div
              aria-hidden="true"
              className="absolute grid size-[17%] min-w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[22%] bg-hero-ink text-[clamp(15px,2.2vw,22px)] font-bold tracking-tight text-hero shadow-[0_0_0_6px_rgb(224_138_98/0.12),0_0_60px_rgb(224_138_98/0.45)]"
              style={{ left: "50%", top: "50%" }}
            >
              PK
              <span className="absolute -right-1 -bottom-1 size-[22%] min-w-3 rounded-full border-[3px] border-hero bg-hero-accent" />
            </div>

            {/* The parts. */}
            {PLACED.map((node, i) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.label}
                  className="node-in absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(node.x / W) * 100}%`, top: `${(node.y / H) * 100}%`, "--i": i } as React.CSSProperties}
                >
                  <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0e1a35]/80 py-1.5 pr-3 pl-2 text-[12px] font-medium whitespace-nowrap text-hero-ink shadow-[0_8px_24px_-12px_rgb(0_0_0/0.8)] backdrop-blur-md sm:text-[13px]">
                    <span className="grid size-5 place-items-center rounded-full bg-hero-accent/15 text-hero-accent max-[420px]:hidden">
                      <Icon className="size-3" aria-hidden="true" />
                    </span>
                    {node.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* What it all ships as: the two live products. */}
          <div className="relative flex flex-wrap items-center gap-2 border-t border-white/[0.08] px-5 py-3.5">
            {featured.map((project) => (
              <a
                key={project.id}
                href={`#${project.id}`}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pr-3.5 pl-1.5 text-[13px] text-hero-ink transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                <span aria-hidden="true" className="size-5 rounded-full" style={{ background: project.tile }} />
                {project.name}
                <span aria-hidden="true" className="text-hero-muted transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            ))}
          </div>
        </figure>
      </div>
    </div>
  );
}
