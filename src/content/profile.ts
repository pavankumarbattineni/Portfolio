/**
 * Everything the site says, in one place. Facts come from the resume and the
 * live projects; edit here and every section updates.
 */

export const profile = {
  name: "Pavan Kumar Battineni",
  shortName: "Pavan Kumar",
  role: "Agentic AI Engineer",
  openTo: "Open to GenAI Engineer and Agentic AI Engineer roles",
  /** Listed in order of preference, without labelling any as secondary. */
  preferredCities: "Hyderabad, Chennai or Bangalore",
  workModes: "Onsite, hybrid or remote",
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

/* ------------------------------------------------------------- projects */

/**
 * One step of a project's request trace. start/end are positions on the run's
 * timeline (0-100): they show order and overlap, not measured timings.
 */
export interface ProjectSpan {
  name: string;
  note: string;
  depth: number;
  start: number;
  end: number;
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
  /** Product mark colours, from each app's own theme. */
  brand: { tile: string; ink: string; dot?: string };
  trace: ProjectSpan[];
  traceCaption: string;
  /** Screenshots of the live app; the first is shown largest. */
  screens: Screen[];
}

export interface Screen {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
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
      "LangSmith tracing across retrieval, reranking and model calls, synced per user so each person can inspect their own runs.",
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
    stack: ["Python", "FastAPI", "LangGraph", "LangChain", "Pinecone", "PostgreSQL", "Firebase", "Docker", "GitHub Actions"],
    brand: { tile: "#d3fb52", ink: "#052326" },
    trace: [
      { name: "chat_request", note: "POST /chat/threads/{id}/messages: JWT, tenant and role scope", depth: 0, start: 0, end: 100 },
      { name: "retrieve", note: "LangGraph retrieval node", depth: 1, start: 3, end: 42 },
      { name: "dense_search", note: "Gemini embeddings on Pinecone", depth: 2, start: 5, end: 30 },
      { name: "sparse_search", note: "keyword weights, same index", depth: 2, start: 5, end: 24 },
      { name: "rerank", note: "best passages first", depth: 2, start: 31, end: 42 },
      { name: "generate", note: "answer with citations", depth: 1, start: 43, end: 98 },
      { name: "sse_stream", note: "resumable with Last-Event-ID", depth: 2, start: 47, end: 98 },
    ],
    traceCaption: "One question through Trench. Dense and sparse search run side by side; every span is recorded in LangSmith.",
    screens: [
      {
        src: "/shots/trench-trace.webp",
        width: 1586,
        height: 967,
        alt: "Trench trace view: a span waterfall with query rewrite, hybrid search, rerank and model calls, beside an inspector showing tokens and cost",
        caption: "The run behind an answer: query rewrite, hybrid search, rerank and the model call, with tokens and cost per step.",
      },
      {
        src: "/shots/trench-answer.webp",
        width: 1120,
        height: 780,
        alt: "A Trench answer with a meal plan, each fact followed by a numbered citation",
        caption: "An answer grounded in an uploaded guide, every fact linked to its source.",
      },
      {
        src: "/shots/trench-chart.webp",
        width: 1100,
        height: 760,
        alt: "Daily targets and a calorie-by-meal bar chart in a Trench answer, with citations",
        caption: "Structured output from the same answer, still cited.",
      },
    ],
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
      "Runs that pause for human approval and resume from LangGraph checkpoints once a decision is made.",
      "Resumable streams, LangSmith tracing, Profile and account deletion, and CI/CD to Render, Vercel and Neon.",
    ],
    hardPart: {
      title: "Long conversations that never overflow the model",
      body: "Earlier turns are sent as question and answer only, without tool calls or reasoning. When history nears 70% of the model's context window (capped at 40k tokens), it is summarized at the start of the next turn, so the agent keeps the facts without running out of room.",
    },
    facts: [
      { value: "5", label: "parallel specialists per agent" },
      { value: "3", label: "LLM providers, your own keys" },
      { value: "65", label: "backend tests" },
    ],
    stack: ["Python", "FastAPI", "LangGraph", "LangChain", "MCP", "PostgreSQL", "Docker", "GitHub Actions"],
    brand: { tile: "#9caf88", ink: "#1d2719", dot: "#e8412c" },
    trace: [
      { name: "chat_request", note: "POST /threads/{id}/messages, from chat or an API key", depth: 0, start: 0, end: 100 },
      { name: "lead_agent", note: "plans and delegates", depth: 1, start: 2, end: 98 },
      { name: "specialist.research", note: "runs in parallel", depth: 2, start: 9, end: 52 },
      { name: "mcp.tool_call", note: "sensitive calls wait for approval", depth: 3, start: 18, end: 40 },
      { name: "specialist.analysis", note: "runs in parallel", depth: 2, start: 9, end: 46 },
      { name: "specialist.writing", note: "runs in parallel", depth: 2, start: 9, end: 58 },
      { name: "stream_answer", note: "streamed, traced, cost tracked", depth: 2, start: 61, end: 98 },
    ],
    traceCaption: "One request through Abyss. Specialists are whatever the agent's builder defines, up to five at once.",
    screens: [
      {
        src: "/shots/abyss-trace.webp",
        width: 1565,
        height: 956,
        alt: "Abyss trace view: an agent run with summarization middleware, the model call and its guard, with duration, tokens and cost",
        caption: "An agent run as recorded in LangSmith: middleware, the model call, 15k tokens and $0.03.",
      },
      {
        src: "/shots/abyss-thread.webp",
        width: 990,
        height: 670,
        alt: "An Abyss agent answering in a thread",
        caption: "A user-built agent answering in its own thread.",
      },
      {
        src: "/shots/abyss-usage.webp",
        width: 1290,
        height: 780,
        alt: "Abyss usage page with total spend, runs, threads and per-run token and cost rows",
        caption: "Token and cost tracking across every agent run.",
      },
    ],
  },
];

/* ----------------------------------------------------------- experience */

export const experience = {
  company: "Innoboon Technologies",
  role: "Associate Software Engineer",
  period: "June 2025 – October 2026",
  location: "Coimbatore, Tamil Nadu, India",
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
  /** One line on what the group is for. */
  blurb: string;
  skills: { name: string; usedIn?: WorkRef[] }[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Agents and LLMs",
    blurb: "Orchestrating multi-agent systems: planning, delegation, tools over MCP and the context each model sees.",
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
    blurb: "Grounding answers in real data, on a degree in AI and machine learning.",
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
    blurb: "The APIs, streams and data models agents run on.",
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
    blurb: "Containers, pipelines and auth that take it to production safely.",
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
  location: "Madurai, Tamil Nadu, India",
};

export const certifications = [
  { name: "Generative AI with Large Language Models", issuer: "DeepLearning.AI and AWS", date: "Sep 2026" },
  { name: "Introduction to Model Context Protocol and Introduction to Agent Skills", issuer: "Anthropic", date: "Jun 2026" },
  { name: "LangChain and LangGraph Essentials", issuer: "LangChain Academy", date: "Jun 2026" },
  { name: "Foundation: Introduction to LangChain (Python)", issuer: "LangChain Academy", date: "Apr 2026" },
  { name: "Introduction to LangGraph", issuer: "LangChain Academy", date: "Sep 2025" },
];
