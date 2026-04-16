import { useState } from "react";

import type { ArchNode, Conn } from "../dashboard-types";

export function useDiagramSelection(nodes: ArchNode[], conns: Conn[]) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [selectedConnId, setSelectedConnId] = useState<string | null>(null);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const editingNode = nodes.find((node) => node.id === editingNodeId);
  const selectedConn = conns.find((conn) => conn.id === selectedConnId);

  const clearSelection = () => {
    setSelectedNodeId(null);
    setSelectedConnId(null);
    setEditingNodeId(null);
  };

  const selectNode = (nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    setSelectedConnId(null);
    setEditingNodeId(null);
  };

  const toggleNodeSelection = (nodeId: string) => {
    setSelectedNodeId((previousNodeId) =>
      previousNodeId === nodeId ? null : nodeId,
    );
    setSelectedConnId(null);
    setEditingNodeId(null);
  };

  const openNodeEditor = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setSelectedConnId(null);
    setEditingNodeId(nodeId);
  };

  const closeNodeEditor = () => {
    setEditingNodeId(null);
  };

  const selectConn = (connId: string | null) => {
    setSelectedConnId(connId);
    setSelectedNodeId(null);
    setEditingNodeId(null);
  };

  return {
    selectedNodeId,
    selectedNode,
    editingNode,
    selectedConnId,
    selectedConn,
    clearSelection,
    selectNode,
    toggleNodeSelection,
    openNodeEditor,
    closeNodeEditor,
    selectConn,
  };
}
