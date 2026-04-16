import type { ArchNode, Conn, EndpointMap } from "../dashboard-types";
import { NodeDetailHeader } from "./node-detail/NodeDetailHeader";
import { NodeEndpointsSection } from "./node-detail/NodeEndpointsSection";
import { NodeFlowsSection } from "./node-detail/NodeFlowsSection";
import {
  getIncomingNodeFlows,
  getNodeEndpoints,
  getOutgoingNodeFlows,
} from "./node-detail/node-detail-utils";

type NodeDetailProps = {
  node: ArchNode;
  nodes: ArchNode[];
  conns: Conn[];
  endpointsByNode: EndpointMap;
};

export function NodeDetail({
  node,
  nodes,
  conns,
  endpointsByNode,
}: NodeDetailProps) {
  const endpoints = getNodeEndpoints(endpointsByNode, node.id);
  const incoming = getIncomingNodeFlows(nodes, conns, node.id);
  const outgoing = getOutgoingNodeFlows(nodes, conns, node.id);

  return (
    <div style={{ animation: "fadeIn .2s ease" }}>
      <NodeDetailHeader node={node} />
      <NodeEndpointsSection endpoints={endpoints} />
      <NodeFlowsSection incoming={incoming} outgoing={outgoing} />
    </div>
  );
}
