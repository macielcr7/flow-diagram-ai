import { NODE_TYPE_LABELS } from "../dashboard-constants";
import type { DashboardSnapshot } from "../dashboard-snapshot";
import type { ArchNode, Conn, NodeType } from "../dashboard-types";
import type { Point } from "./diagram-editor-types";

export function createNodeId(): string {
  return `node-${Date.now()}`;
}

export function createConnectionId(): string {
  return `c${Date.now()}`;
}

export function addNodeToSnapshot(
  snapshot: DashboardSnapshot,
  node: ArchNode,
): DashboardSnapshot {
  return {
    ...snapshot,
    layout: {
      ...snapshot.layout,
      nodes: [...snapshot.layout.nodes, node],
    },
    endpointsByNode: {
      ...snapshot.endpointsByNode,
      [node.id]: snapshot.endpointsByNode[node.id] ?? [],
    },
  };
}

export function updateNodeInSnapshot(
  snapshot: DashboardSnapshot,
  nodeId: string,
  patch: Partial<ArchNode>,
): DashboardSnapshot {
  return {
    ...snapshot,
    layout: {
      ...snapshot.layout,
      nodes: snapshot.layout.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...patch } : node,
      ),
    },
  };
}

export function duplicateNodeInSnapshot(
  snapshot: DashboardSnapshot,
  nodeId: string,
  duplicateId: string,
): DashboardSnapshot {
  const sourceNode = snapshot.layout.nodes.find((node) => node.id === nodeId);
  if (!sourceNode) {
    return snapshot;
  }

  const duplicateNode: ArchNode = {
    ...sourceNode,
    id: duplicateId,
    label: `${sourceNode.label} Copy`,
    x: sourceNode.x + 34,
    y: sourceNode.y + 34,
  };

  return {
    ...snapshot,
    layout: {
      ...snapshot.layout,
      nodes: [...snapshot.layout.nodes, duplicateNode],
    },
    endpointsByNode: {
      ...snapshot.endpointsByNode,
      [duplicateId]: [...(snapshot.endpointsByNode[nodeId] ?? [])],
    },
  };
}

export function removeNodeFromSnapshot(
  snapshot: DashboardSnapshot,
  nodeId: string,
): DashboardSnapshot {
  const remainingEndpoints = Object.fromEntries(
    Object.entries(snapshot.endpointsByNode).filter(([key]) => key !== nodeId),
  );

  return {
    ...snapshot,
    layout: {
      ...snapshot.layout,
      nodes: snapshot.layout.nodes.filter((node) => node.id !== nodeId),
      connections: snapshot.layout.connections.filter(
        (conn) => conn.from !== nodeId && conn.to !== nodeId,
      ),
    },
    endpointsByNode: remainingEndpoints,
  };
}

export function addConnectionToSnapshot(
  snapshot: DashboardSnapshot,
  connection: Conn,
): DashboardSnapshot {
  return {
    ...snapshot,
    layout: {
      ...snapshot.layout,
      connections: [...snapshot.layout.connections, connection],
    },
  };
}

export function updateConnectionInSnapshot(
  snapshot: DashboardSnapshot,
  connectionId: string,
  patch: Partial<Conn>,
): DashboardSnapshot {
  return {
    ...snapshot,
    layout: {
      ...snapshot.layout,
      connections: snapshot.layout.connections.map((conn) =>
        conn.id === connectionId ? { ...conn, ...patch } : conn,
      ),
    },
  };
}

export function removeConnectionFromSnapshot(
  snapshot: DashboardSnapshot,
  connectionId: string,
): DashboardSnapshot {
  return {
    ...snapshot,
    layout: {
      ...snapshot.layout,
      connections: snapshot.layout.connections.filter(
        (conn) => conn.id !== connectionId,
      ),
    },
  };
}

export function createDroppedNode(
  nodeId: string,
  type: NodeType,
  point: Point,
): ArchNode {
  return {
    id: nodeId,
    label: `New ${NODE_TYPE_LABELS[type]}`,
    sublabel: type,
    type,
    tech: "",
    x: point.x - 82,
    y: point.y - 46,
    w: 165,
    h: 92,
    ops: [],
  };
}
