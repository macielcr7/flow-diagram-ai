import type { HttpMethod, NodeType } from "./dashboard-types";

export const T: Record<
  NodeType,
  {
    bg: string;
    top: string;
    border: string;
    badgeBg: string;
    badgeFg: string;
  }
> = {
  GATEWAY: {
    bg: "#0e1f12",
    top: "#22c55e",
    border: "#16a34a",
    badgeBg: "#14532d",
    badgeFg: "#86efac",
  },
  SERVICE: {
    bg: "#0d1829",
    top: "#3b82f6",
    border: "#1d4ed8",
    badgeBg: "#1e3a5f",
    badgeFg: "#93c5fd",
  },
  DATABASE: {
    bg: "#0a1a14",
    top: "#10b981",
    border: "#059669",
    badgeBg: "#064e3b",
    badgeFg: "#6ee7b7",
  },
  QUEUE: {
    bg: "#150e29",
    top: "#8b5cf6",
    border: "#7c3aed",
    badgeBg: "#2e1065",
    badgeFg: "#c4b5fd",
  },
  EXTERNAL: {
    bg: "#1c1007",
    top: "#f97316",
    border: "#ea580c",
    badgeBg: "#431407",
    badgeFg: "#fdba74",
  },
  WORKER: {
    bg: "#071b23",
    top: "#06b6d4",
    border: "#0891b2",
    badgeBg: "#164e63",
    badgeFg: "#67e8f9",
  },
  CACHE: {
    bg: "#1a0e0e",
    top: "#ef4444",
    border: "#dc2626",
    badgeBg: "#450a0a",
    badgeFg: "#fca5a5",
  },
  LOAD_BALANCER: {
    bg: "#22110d",
    top: "#f43f5e",
    border: "#e11d48",
    badgeBg: "#4c0519",
    badgeFg: "#fda4af",
  },
  AUTH_PROVIDER: {
    bg: "#21180a",
    top: "#f59e0b",
    border: "#d97706",
    badgeBg: "#78350f",
    badgeFg: "#fcd34d",
  },
  OBJECT_STORAGE: {
    bg: "#081f1d",
    top: "#14b8a6",
    border: "#0f766e",
    badgeBg: "#134e4a",
    badgeFg: "#99f6e4",
  },
  CDN: {
    bg: "#111827",
    top: "#6366f1",
    border: "#4f46e5",
    badgeBg: "#312e81",
    badgeFg: "#c7d2fe",
  },
  OBSERVABILITY: {
    bg: "#1a1125",
    top: "#a855f7",
    border: "#9333ea",
    badgeBg: "#581c87",
    badgeFg: "#e9d5ff",
  },
  FEATURE_FLAGS: {
    bg: "#1b1507",
    top: "#eab308",
    border: "#ca8a04",
    badgeBg: "#713f12",
    badgeFg: "#fde68a",
  },
  SEARCH_ENGINE: {
    bg: "#0c1720",
    top: "#0ea5e9",
    border: "#0284c7",
    badgeBg: "#0c4a6e",
    badgeFg: "#bae6fd",
  },
  EMAIL_GATEWAY: {
    bg: "#1f1017",
    top: "#ec4899",
    border: "#db2777",
    badgeBg: "#831843",
    badgeFg: "#fbcfe8",
  },
};

export const ICONS: Record<NodeType, string> = {
  GATEWAY: "🛡",
  SERVICE: "⬡",
  DATABASE: "🗄",
  QUEUE: "⫐",
  EXTERNAL: "🌐",
  WORKER: "⚙",
  CACHE: "⚡",
  LOAD_BALANCER: "⚖",
  AUTH_PROVIDER: "🔐",
  OBJECT_STORAGE: "🗃",
  CDN: "📡",
  OBSERVABILITY: "📈",
  FEATURE_FLAGS: "🚩",
  SEARCH_ENGINE: "🔎",
  EMAIL_GATEWAY: "✉",
};

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  GATEWAY: "Gateway",
  SERVICE: "Service",
  DATABASE: "Database",
  QUEUE: "Queue",
  EXTERNAL: "External",
  WORKER: "Worker",
  CACHE: "Cache",
  LOAD_BALANCER: "Load Balancer",
  AUTH_PROVIDER: "Auth Provider",
  OBJECT_STORAGE: "Object Storage",
  CDN: "CDN",
  OBSERVABILITY: "Observability",
  FEATURE_FLAGS: "Feature Flags",
  SEARCH_ENGINE: "Search Engine",
  EMAIL_GATEWAY: "Email Gateway",
};

export const METHOD_COLORS: Record<HttpMethod, { bg: string; text: string }> =
  {
    GET: { bg: "#064e3b", text: "#6ee7b7" },
    POST: { bg: "#1e3a5f", text: "#93c5fd" },
    PUT: { bg: "#3b2400", text: "#fb923c" },
    DELETE: { bg: "#450a0a", text: "#fca5a5" },
    PATCH: { bg: "#2e1065", text: "#c4b5fd" },
  };

export const ALL_TYPES: NodeType[] = [
  "SERVICE",
  "DATABASE",
  "QUEUE",
  "EXTERNAL",
  "WORKER",
  "CACHE",
  "GATEWAY",
  "LOAD_BALANCER",
  "AUTH_PROVIDER",
  "OBJECT_STORAGE",
  "CDN",
  "OBSERVABILITY",
  "FEATURE_FLAGS",
  "SEARCH_ENGINE",
  "EMAIL_GATEWAY",
];

export const CSS = `
  @keyframes flowDash     { from{stroke-dashoffset:34} to{stroke-dashoffset:0} }
  @keyframes flowDashSlow { from{stroke-dashoffset:26} to{stroke-dashoffset:0} }
  @keyframes blink        { 0%,100%{opacity:1} 50%{opacity:.35} }
  @keyframes scanLine     { 0%{opacity:0;transform:translateY(0)} 40%{opacity:1} 100%{opacity:0;transform:translateY(180px)} }
  @keyframes progressFill { from{width:0%} to{width:100%} }
  @keyframes fadeIn       { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #07101f; }
  ::-webkit-scrollbar-thumb { background: #1e2d4a; border-radius: 4px; }
  input, select { font-family: inherit; }
  input:focus, select:focus { outline: 1px solid #2563eb; }
`;
