import { ImageResponse } from "next/og";

import { profile } from "@/content/profile";

export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SPANS = [
  { name: "lead_agent", left: 0, width: 100, depth: 0 },
  { name: "plan", left: 2, width: 15, depth: 1 },
  { name: "hybrid_search", left: 18, width: 20, depth: 1 },
  { name: "mcp.langchain", left: 20, width: 29, depth: 1 },
  { name: "stream_answer", left: 58, width: 42, depth: 1 },
];

/** The link preview: name and role beside a finished trace, in the site's colours. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#13213f", color: "#f4f6fa", padding: 72, gap: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <div style={{ fontSize: 30, color: "#aab4c8" }}>{profile.role}</div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2, marginTop: 14 }}>{profile.name}</div>
          <div style={{ fontSize: 28, color: "#aab4c8", marginTop: 28, lineHeight: 1.4 }}>
            Multi-agent systems with FastAPI, LangGraph and MCP.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 470,
            alignSelf: "center",
            background: "#1b2b4f",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 24,
            padding: 28,
            gap: 18,
          }}
        >
          {SPANS.map((span) => (
            <div key={span.name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", width: 170, fontSize: 19, color: "#f4f6fa", paddingLeft: span.depth * 14 }}>{span.name}</div>
              <div style={{ display: "flex", flex: 1, height: 12, position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: `${span.left}%`,
                    width: `${span.width}%`,
                    height: 12,
                    borderRadius: 6,
                    background: span.depth === 0 ? "#e08a62" : "rgba(170,180,200,0.6)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
