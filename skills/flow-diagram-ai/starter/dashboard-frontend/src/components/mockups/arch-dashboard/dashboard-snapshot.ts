import { ZodError, z } from "zod";

import type {
  ArchNode,
  Conn,
  DashboardAnalysisStats,
  DashboardDiagramSummary,
  EndpointMap,
  ConnRouteAxis,
  HttpMethod,
  NodeType,
} from "./dashboard-types";

const nodeTypeValues = [
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
] as const satisfies readonly NodeType[];

const httpMethodValues = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
] as const satisfies readonly HttpMethod[];

const connRouteAxisValues = ["x", "y"] as const satisfies readonly ConnRouteAxis[];

export const nodeTypeSchema = z.enum(nodeTypeValues);
export const httpMethodSchema = z.enum(httpMethodValues);
export const connRouteAxisSchema = z.enum(connRouteAxisValues);

export const endpointSchema = z.object({
  method: httpMethodSchema,
  path: z.string().min(1),
});

export const endpointMapSchema = z.record(z.array(endpointSchema));

export const archNodeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sublabel: z.string().min(1),
  type: nodeTypeSchema,
  tech: z.string(),
  x: z.number(),
  y: z.number(),
  w: z.number().positive(),
  h: z.number().positive(),
  ops: z.array(z.string()),
});

export const connSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  label: z.string(),
  dashed: z.boolean(),
  routing: z
    .object({
      axis: connRouteAxisSchema,
      value: z.number(),
    })
    .optional(),
});

export const dashboardDiagramSummarySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  desc: z.string().min(1),
  dot: z.boolean(),
});

export const dashboardAnalysisStatsSchema = z.object({
  services: z.number().int().nonnegative(),
  endpoints: z.number().int().nonnegative(),
  flows: z.number().int().nonnegative(),
});

export const dashboardSnapshotSchema = z.object({
  version: z.literal(1),
  meta: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    systemSlug: z.string().min(1),
    status: z.enum(["draft", "analyzed"]),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
  diagrams: z.array(dashboardDiagramSummarySchema),
  layout: z.object({
    nodes: z.array(archNodeSchema),
    connections: z.array(connSchema),
  }),
  endpointsByNode: endpointMapSchema,
  analysis: z.object({
    source: z.enum(["mock", "ai"]),
    lastAnalyzedAt: z.string().datetime().nullable(),
    stats: dashboardAnalysisStatsSchema,
  }),
});

export type DashboardSnapshot = z.infer<typeof dashboardSnapshotSchema>;
export type DashboardSnapshotStatus = DashboardSnapshot["meta"]["status"];
export type DashboardSnapshotAnalysis = DashboardSnapshot["analysis"];

export function parseDashboardSnapshot(input: unknown): DashboardSnapshot {
  return dashboardSnapshotSchema.parse(input);
}

export function cloneDashboardSnapshot(
  snapshot: DashboardSnapshot,
): DashboardSnapshot {
  return structuredClone(snapshot);
}

export function stringifyDashboardSnapshot(snapshot: DashboardSnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}

export function calculateAnalysisStatsFromSnapshot(
  snapshot: Pick<DashboardSnapshot, "layout" | "endpointsByNode">,
): DashboardAnalysisStats {
  return {
    services: snapshot.layout.nodes.length,
    endpoints: Object.values(snapshot.endpointsByNode).reduce(
      (total, endpoints) => total + endpoints.length,
      0,
    ),
    flows: snapshot.layout.connections.length,
  };
}

export function touchDashboardSnapshot(
  snapshot: DashboardSnapshot,
  options: {
    status?: DashboardSnapshotStatus;
    analysis?: Partial<DashboardSnapshotAnalysis>;
  } = {},
): DashboardSnapshot {
  const nextSnapshot = cloneDashboardSnapshot(snapshot);
  const stats = calculateAnalysisStatsFromSnapshot(nextSnapshot);

  return {
    ...nextSnapshot,
    meta: {
      ...nextSnapshot.meta,
      status: options.status ?? nextSnapshot.meta.status,
      updatedAt: new Date().toISOString(),
    },
    analysis: {
      ...nextSnapshot.analysis,
      ...options.analysis,
      stats: options.analysis?.stats ?? stats,
    },
  };
}

function formatIssuePath(path: Array<string | number>): string {
  if (path.length === 0) {
    return "snapshot";
  }

  return path.reduce<string>((acc, segment) => {
    if (typeof segment === "number") {
      return `${acc}[${segment}]`;
    }

    if (!acc) {
      return segment;
    }

    return `${acc}.${segment}`;
  }, "");
}

export function formatDashboardSnapshotError(error: unknown): string {
  if (error instanceof SyntaxError) {
    return `Invalid JSON syntax.\n${error.message}`;
  }

  if (error instanceof ZodError) {
    const formattedIssues = error.issues
      .slice(0, 8)
      .map((issue) => `${formatIssuePath(issue.path)}: ${issue.message}`);

    if (error.issues.length > 8) {
      formattedIssues.push(`...and ${error.issues.length - 8} more issues.`);
    }

    return formattedIssues.join("\n");
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Invalid snapshot JSON.";
}

export function parseDashboardSnapshotText(jsonText: string): DashboardSnapshot {
  return parseDashboardSnapshot(JSON.parse(jsonText));
}

export type DashboardSnapshotNode = ArchNode;
export type DashboardSnapshotConnection = Conn;
export type DashboardSnapshotDiagram = DashboardDiagramSummary;
export type DashboardSnapshotEndpoints = EndpointMap;
