export type NodeType =
  | "SERVICE"
  | "DATABASE"
  | "QUEUE"
  | "EXTERNAL"
  | "WORKER"
  | "CACHE"
  | "GATEWAY"
  | "LOAD_BALANCER"
  | "AUTH_PROVIDER"
  | "OBJECT_STORAGE"
  | "CDN"
  | "OBSERVABILITY"
  | "FEATURE_FLAGS"
  | "SEARCH_ENGINE"
  | "EMAIL_GATEWAY";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ConnRouteAxis = "x" | "y";

export interface Endpoint {
  method: HttpMethod;
  path: string;
}

export type EndpointMap = Record<string, Endpoint[]>;

export interface ArchNode {
  id: string;
  label: string;
  sublabel: string;
  type: NodeType;
  tech: string;
  x: number;
  y: number;
  w: number;
  h: number;
  ops: string[];
}

export interface Conn {
  id: string;
  from: string;
  to: string;
  label: string;
  dashed: boolean;
  routing?: {
    axis: ConnRouteAxis;
    value: number;
  };
}

export interface DashboardDiagramSummary {
  id: string;
  name: string;
  desc: string;
  dot: boolean;
}

export interface DashboardAnalysisStats {
  services: number;
  endpoints: number;
  flows: number;
}

export type AnalysisState = "idle" | "scanning" | "done";
