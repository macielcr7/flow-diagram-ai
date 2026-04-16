import type { ArchNode, Conn, EndpointMap } from "../../dashboard-types";

export function getNodeEndpoints(
  endpointsByNode: EndpointMap,
  nodeId: string,
) {
  return endpointsByNode[nodeId] || [];
}

export function getIncomingNodeFlows(
  nodes: ArchNode[],
  conns: Conn[],
  nodeId: string,
) {
  return conns
    .filter((conn) => conn.to === nodeId)
    .map((conn) => ({ conn, node: nodes.find((node) => node.id === conn.from)! }))
    .filter((entry) => entry.node);
}

export function getOutgoingNodeFlows(
  nodes: ArchNode[],
  conns: Conn[],
  nodeId: string,
) {
  return conns
    .filter((conn) => conn.from === nodeId)
    .map((conn) => ({ conn, node: nodes.find((node) => node.id === conn.to)! }))
    .filter((entry) => entry.node);
}
