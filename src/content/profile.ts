/**
 * Everything the site says, in one place. Facts come from the resume and the
 * live projects; edit here and every section updates.
 */

export const profile = {
  name: "Pavan Kumar Battineni",
  shortName: "Pavan Kumar",
  role: "Agentic AI Engineer",
  openTo: "Open to GenAI Engineer and Agentic AI Engineer roles",
  intro:
    "I build multi-agent AI systems that hold up in production: orchestration, MCP tool servers and real-time backends with FastAPI, LangGraph and PostgreSQL, shipped with Docker and CI/CD.",
  location: "Andhra Pradesh, India",
  email: "battinenipavankumar1@gmail.com",
  phone: "+91 7995027195",
  phoneHref: "tel:+917995027195",
  links: {
    github: "https://github.com/pavankumarbattineni",
    linkedin: "https://www.linkedin.com/in/pavan-kumar-battineni-b42313332/",
    source: "https://github.com/pavankumarbattineni/Portfolio",
  },
  resume: "/Pavan_Kumar_Battineni_Resume.pdf",
} as const;

/** Where a skill was used, so the Skills section can point at the work. */
export type WorkRef = "trench" | "abyss" | "innoboon" | "degree";

export const workLabels: Record<WorkRef, { label: string; href: string }> = {
  trench: { label: "Trench", href: "#trench" },
  abyss: { label: "Abyss", href: "#abyss" },
  innoboon: { label: "Innoboon", href: "#experience" },
  degree: { label: "B.Tech, AI & ML", href: "#education" },
};

/* ------------------------------------------------------------------ hero */

export type SpanKind = "agent" | "llm" | "retriever" | "tool" | "stream";

export interface TraceSpan {
  name: string;
  kind: SpanKind;
  depth: number;
  /** Start and length in ms on the run's timeline. */
  start: number;
  duration: number;
  /** What the span does, in plain words. */
  explain: string;
}

/** The hero's agent run: answering "Who is Pavan?" the way his systems would. */
export const heroTrace: TraceSpan[] = [
  {
    name: "lead_agent",
    kind: "agent",
    depth: 0,
    start: 0,
    duration: 2600,
    explain: "The lead agent plans the answer, hands parts of it to specialists and writes the final reply.",
  },
  {
    name: "plan",
    kind: "llm",
    depth: 1,
    start: 60,
    duration: 380,
    explain: "One model call decides which tools and specialists the question needs.",
  },
  {
    name: "hybrid_search",
    kind: "retriever",
    depth: 1,
    start: 480,
    duration: 520,
    explain: "Searches by meaning (dense embeddings) and by keywords (sparse) at once, then merges the results.",
  },
  {
    name: "rerank",
    kind: "tool",
    depth: 2,
    start: 1010,
    duration: 210,
    explain: "Reorders the retrieved passages so the most relevant ones reach the model first.",
  },
  {
    name: "mcp.github",
    kind: "tool",
    depth: 1,
    start: 520,
    duration: 760,
    explain: "A typed tool call over the Model Context Protocol, the way agents reach external systems safely.",
  },
  {
    name: "specialist",
    kind: "agent",
    depth: 1,
    start: 560,
    duration: 900,
    explain: "A sub-agent works in parallel on one part of the question and reports back to the lead.",
  },
  {
    name: "stream_answer",
    kind: "stream",
    depth: 1,
    start: 1500,
    duration: 1080,
    explain: "The reply streams token by token over SSE. Every event has an id, so a dropped connection resumes where it stopped.",
  },
];

export const heroOutput =
  "An Agentic AI Engineer who designs agent systems that are streamed, traced and tested before they ship.";

/* ------------------------------------------------------------- projects */

export interface Stage {
  label: string;
  detail?: string;
  /** Parallel steps shown side by side. */
  parallel?: { label: string; detail?: string }[];
}

export interface Project {
  id: "trench" | "abyss";
  name: string;
  tagline: string;
  period: string;
  live: string;
  /** Where the project came from, shown under the tagline. */
  origin?: string;
  problem: string;
  built: string[];
  hardPart: { title: string; body: string };
  facts: { value: string; label: string }[];
  stack: string[];
  flow: Stage[];
  flowCaption: string;
}

export const projects: Project[] = [
  {
    id: "trench",
    name: "Trench",
    tagline: "An AI knowledge assistant that cites its sources",
    period: "Sep 2026 – Nov 2026",
    live: "https://trenchai.vercel.app",
    problem:
      "Team knowledge lives in scattered documents. Trench lets people ask questions across their own uploads and their organization's shared knowledge base, and every answer points to the passage it came from.",
    built: [
      "A multi-tenant RAG backend with Firebase JWT sign-in and roles that separate personal documents from organization-wide knowledge.",
      "A LangGraph retrieval workflow: dense (Gemini) and sparse embeddings searched together on Pinecone, then reranked before the model answers.",
      "Resumable SSE streaming, so an answer survives a refresh or a dropped connection.",
      "A Tracing page built on LangSmith that shows each user their own runs as a span waterfall.",
      "Docker and Docker Compose, plus GitHub Actions CI/CD with a gated, staged deploy to Render, Vercel and Neon.",
    ],
    hardPart: {
      title: "Answers that survive a dropped connection",
      body: "Every streamed event carries an id. When the browser reconnects it sends Last-Event-ID, and the server replays only what was missed, so the answer continues instead of starting over.",
    },
    facts: [
      { value: "370+", label: "automated tests" },
      { value: "2", label: "retrieval signals, dense and sparse" },
      { value: "3", label: "deploy targets: Render, Vercel, Neon" },
    ],
    stack: ["Python", "FastAPI", "LangGraph", "LangChain", "Pinecone", "PostgreSQL", "Firebase", "Docker", "GitHub Actions", "Next.js"],
    flow: [
      { label: "Question", detail: "Next.js client, Firebase sign-in" },
      { label: "FastAPI", detail: "JWT check, tenant and role scope" },
      {
        label: "Hybrid retrieval",
        parallel: [
          { label: "Dense", detail: "Gemini embeddings" },
          { label: "Sparse", detail: "keyword weights" },
        ],
      },
      { label: "Rerank", detail: "best passages first" },
      { label: "Answer with citations", detail: "streamed over resumable SSE" },
    ],
    flowCaption: "One question through Trench. Every step is traced in LangSmith.",
  },
  {
    id: "abyss",
    name: "Abyss",
    tagline: "A no-code platform for teams of AI agents",
    period: "Jun 2026 – Nov 2026",
    live: "https://abyss-fleet.vercel.app",
    origin:
      "Abyss started as Thinkloop, the proof of concept I built at Innoboon. I took it over as my own product, renamed it, and rebuilt and extended it end to end.",
    problem:
      "Building an agent usually means writing orchestration code. In Abyss you describe what an agent does, connect the tools it needs over MCP, and give it up to five specialists that work in parallel, while sensitive actions wait for your approval.",
    built: [
      "A LangGraph lead agent that delegates to up to five specialists running in parallel, with MCP tool connections and human approval before sensitive tools run.",
      "Bring-your-own-key access to OpenAI, Anthropic and Gemini models, with token and cost tracking per run.",
      "Long conversations that stay within the model's context window: earlier turns are trimmed to question and answer, then summarized at the start of a turn when they grow too large.",
      "Live previews of agent-written HTML and React apps, rendered right in the chat.",
      "Resumable streams, LangSmith tracing, Profile and account deletion, and CI/CD to Render, Vercel and Neon.",
    ],
    hardPart: {
      title: "Running code a model wrote, safely",
      body: "Previews run in a sandboxed iframe with an opaque origin and a Content Security Policy that blocks all network access, so agent-written apps can't read the session, call out or navigate the page.",
    },
    facts: [
      { value: "5", label: "parallel specialists per agent" },
      { value: "3", label: "LLM providers, your own keys" },
      { value: "65", label: "backend tests" },
    ],
    stack: ["Python", "FastAPI", "LangGraph", "LangChain", "MCP", "PostgreSQL", "Docker", "GitHub Actions", "Next.js"],
    flow: [
      { label: "Request", detail: "chat or API" },
      { label: "Lead agent", detail: "plans and delegates" },
      {
        label: "Specialists in parallel",
        parallel: [
          { label: "Research" },
          { label: "Analysis" },
          { label: "Writing" },
        ],
      },
      { label: "MCP tools", detail: "sensitive calls wait for approval" },
      { label: "Answer", detail: "streamed, traced, cost tracked" },
    ],
    flowCaption: "One request through Abyss. Specialists are whatever the agent's builder defines.",
  },
];

/* ----------------------------------------------------------- experience */

export const experience = {
  company: "Innoboon Technologies",
  role: "Associate Software Engineer",
  period: "June 2025 – October 2026",
  location: "Andhra Pradesh, India",
  highlights: [
    {
      metric: "23",
      unit: "REST operations",
      text: "Engineered a production AI investment-research orchestration platform across agent management, streaming chat, research universes, signals and conviction analysis.",
    },
    {
      metric: "24",
      unit: "typed MCP tools",
      text: "Architected a stateless Model Context Protocol server for external AI clients, secured with API keys and OAuth 2.1/PKCE with Dynamic Client Registration, and SHA-256 hashed credential storage.",
    },
    {
      metric: "3",
      unit: "LLM providers",
      text: "Independently built Thinkloop, the no-code multi-agent backend behind TickerLens, with human-in-the-loop tool approval and bring-your-own-key support via LiteLLM.",
    },
  ],
  projects: [
    {
      name: "TickerLens",
      period: "Aug 2025 – Oct 2026",
      points: [
        "Built Investor Desk end to end: a 4-step onboarding wizard that deploys user-configured AI crews against a stock universe, driving a signal-to-conviction-to-recommendation pipeline.",
        "Added push notifications with Firebase Cloud Messaging.",
      ],
      stack: ["Python", "FastAPI", "PostgreSQL", "Firebase Cloud Messaging"],
    },
    {
      name: "Thinkloop",
      period: "Jun 2026 – Aug 2026",
      points: [
        "Designed and built a multi-agent backend end to end as the agent-execution platform powering TickerLens' Investor Desk.",
        "Resumable SSE streaming (Last-Event-ID), tool-approval gating, and per-run token and cost tracking across 3 providers.",
      ],
      continuedAs: { label: "Now continued as Abyss, my own product", href: "#abyss" },
      stack: ["Python", "FastAPI", "PostgreSQL", "LangGraph", "LiteLLM"],
    },
  ],
};

/* --------------------------------------------------------------- skills */

export interface SkillGroup {
  title: string;
  skills: { name: string; usedIn?: WorkRef[] }[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Agents and LLMs",
    skills: [
      { name: "Agentic AI", usedIn: ["abyss", "innoboon"] },
      { name: "LangGraph", usedIn: ["trench", "abyss", "innoboon"] },
      { name: "LangChain", usedIn: ["trench", "abyss", "innoboon"] },
      { name: "Model Context Protocol", usedIn: ["abyss", "innoboon"] },
      { name: "RAG", usedIn: ["trench"] },
      { name: "Prompt and context engineering", usedIn: ["trench", "abyss"] },
      { name: "Prompt caching" },
      { name: "Generative AI", usedIn: ["trench", "abyss", "innoboon"] },
    ],
  },
  {
    title: "Retrieval and ML foundations",
    skills: [
      { name: "Vector databases", usedIn: ["trench"] },
      { name: "Embeddings", usedIn: ["trench"] },
      { name: "Transformers", usedIn: ["degree"] },
      { name: "Tokenization", usedIn: ["degree"] },
      { name: "Neural networks", usedIn: ["degree"] },
      { name: "NLP", usedIn: ["degree"] },
    ],
  },
  {
    title: "Backend and data",
    skills: [
      { name: "Python", usedIn: ["trench", "abyss", "innoboon"] },
      { name: "FastAPI", usedIn: ["trench", "abyss", "innoboon"] },
      { name: "PostgreSQL", usedIn: ["trench", "abyss", "innoboon"] },
      { name: "SQLAlchemy (async)", usedIn: ["trench", "abyss"] },
      { name: "Pinecone", usedIn: ["trench"] },
      { name: "Server-sent events", usedIn: ["trench", "abyss", "innoboon"] },
      { name: "Postman" },
    ],
  },
  {
    title: "Shipping and security",
    skills: [
      { name: "Docker and Compose", usedIn: ["trench", "abyss"] },
      { name: "GitHub Actions CI/CD", usedIn: ["trench", "abyss"] },
      { name: "Render, Vercel, Neon", usedIn: ["trench", "abyss"] },
      { name: "OAuth 2.1 / PKCE", usedIn: ["innoboon"] },
      { name: "JWT", usedIn: ["trench", "abyss"] },
      { name: "LangSmith tracing", usedIn: ["trench", "abyss", "innoboon"] },
    ],
  },
];

/* ---------------------------------------------------- education & certs */

export const education = {
  school: "Kalasalingam Academy of Research and Education",
  degree: "B.Tech, Artificial Intelligence and Machine Learning",
  grade: "CGPA 8.35",
  period: "2021 – 2025",
  location: "Tamil Nadu, India",
};

export const certifications = [
  { name: "Generative AI with Large Language Models", issuer: "DeepLearning.AI and AWS", date: "Sep 2026" },
  { name: "Introduction to Model Context Protocol and Introduction to Agent Skills", issuer: "Anthropic", date: "Jun 2026" },
  { name: "LangChain and LangGraph Essentials", issuer: "LangChain Academy", date: "Jun 2026" },
  { name: "Foundation: Introduction to LangChain (Python)", issuer: "LangChain Academy", date: "Apr 2026" },
  { name: "Introduction to LangGraph", issuer: "LangChain Academy", date: "Sep 2025" },
];
