import { useRef, useState, type DragEvent, type MouseEvent } from "react";

import type { DashboardSnapshot } from "./dashboard-snapshot";
import type { ArchNode, Conn, ConnRouteAxis, NodeType } from "./dashboard-types";
import {
  addConnectionToSnapshot,
  addNodeToSnapshot,
  createConnectionId,
  createDroppedNode,
  createNodeId,
  duplicateNodeInSnapshot,
  removeConnectionFromSnapshot,
  removeNodeFromSnapshot,
  updateConnectionInSnapshot,
  updateNodeInSnapshot,
} from "./editor/diagram-editor-snapshot";
import {
  DEFAULT_ADD_POS,
  type Point,
} from "./editor/diagram-editor-types";
import { useDiagramSelection } from "./editor/use-diagram-selection";
import { useDiagramViewport } from "./editor/use-diagram-viewport";

export function useDiagramEditor(
  snapshot: DashboardSnapshot,
  updateSnapshot: (
    updater: (currentSnapshot: DashboardSnapshot) => DashboardSnapshot,
  ) => void,
) {
  const nodes = snapshot.layout.nodes;
  const conns = snapshot.layout.connections;
  const [editMode, setEditMode] = useState(true);
  const [animOn, setAnimOn] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addPos, setAddPos] = useState(DEFAULT_ADD_POS);
  const [connPreview, setConnPreview] = useState<Point | null>(null);
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const [routePreview, setRoutePreview] = useState<{
    connId: string;
    routing: NonNullable<Conn["routing"]>;
  } | null>(null);
  const [routeDragAxis, setRouteDragAxis] = useState<ConnRouteAxis | null>(null);
  const [hoveredConnectTargetId, setHoveredConnectTargetId] = useState<
    string | null
  >(null);

  const dragNode = useRef<{ id: string; ox: number; oy: number } | null>(null);
  const routeDrag = useRef<{
    connId: string;
    axis: ConnRouteAxis;
    startValue: number;
    moved: boolean;
  } | null>(null);
  const connFrom = useRef<string | null>(null);
  const suppressNextNodeClick = useRef(false);
  const didDrag = useRef(false);

  const selection = useDiagramSelection(nodes, conns);
  const viewport = useDiagramViewport();

  const sourceNode = connectingFromId
    ? nodes.find((node) => node.id === connectingFromId) ?? null
    : null;

  const clearConnectionPreview = () => {
    connFrom.current = null;
    setConnectingFromId(null);
    setConnPreview(null);
    setHoveredConnectTargetId(null);
  };

  const clearRoutePreview = () => {
    routeDrag.current = null;
    setRoutePreview(null);
    setRouteDragAxis(null);
  };

  const createConnection = (fromId: string, toId: string) => {
    if (fromId === toId) {
      clearConnectionPreview();
      return;
    }

    const existingConnection = conns.find(
      (conn) => conn.from === fromId && conn.to === toId,
    );

    if (existingConnection) {
      selection.selectConn(existingConnection.id);
      clearConnectionPreview();
      return;
    }

    const connectionId = createConnectionId();

    updateSnapshot((currentSnapshot) =>
      addConnectionToSnapshot(currentSnapshot, {
        id: connectionId,
        from: fromId,
        to: toId,
        label: "→",
        dashed: false,
      }),
    );

    selection.selectConn(connectionId);
    clearConnectionPreview();
  };

  const startConnectionFromNode = (nodeId: string) => {
    connFrom.current = nodeId;
    setConnectingFromId(nodeId);
    selection.selectNode(nodeId);
  };

  const cancelConnection = () => {
    clearConnectionPreview();
  };

  const openAddDialog = (pos: Point = DEFAULT_ADD_POS) => {
    setAddPos(pos);
    setShowAdd(true);
  };

  const closeAddDialog = () => {
    setShowAdd(false);
  };

  const addNode = (node: Omit<ArchNode, "id">) => {
    const nodeId = createNodeId();

    updateSnapshot((currentSnapshot) =>
      addNodeToSnapshot(currentSnapshot, { ...node, id: nodeId }),
    );

    selection.selectNode(nodeId);
  };

  const updateNode = (id: string, patch: Partial<ArchNode>) => {
    updateSnapshot((currentSnapshot) =>
      updateNodeInSnapshot(currentSnapshot, id, patch),
    );
  };

  const deleteNode = (id: string) => {
    updateSnapshot((currentSnapshot) => removeNodeFromSnapshot(currentSnapshot, id));
    selection.clearSelection();
  };

  const duplicateNode = (id: string) => {
    const duplicateId = createNodeId();

    updateSnapshot((currentSnapshot) =>
      duplicateNodeInSnapshot(currentSnapshot, id, duplicateId),
    );

    selection.selectNode(duplicateId);
  };

  const updateConn = (id: string, patch: Partial<Conn>) => {
    updateSnapshot((currentSnapshot) =>
      updateConnectionInSnapshot(currentSnapshot, id, patch),
    );
  };

  const deleteConn = (id: string) => {
    updateSnapshot((currentSnapshot) =>
      removeConnectionFromSnapshot(currentSnapshot, id),
    );
    selection.selectConn(null);
  };

  const centerNode = (id: string) => {
    const node = nodes.find((item) => item.id === id);
    if (!node) return;

    viewport.focusNode(node);
    selection.selectNode(id);
  };

  const onNodeMouseDown = (id: string, e: MouseEvent<SVGGElement>) => {
    if (!editMode || connFrom.current) return;

    e.stopPropagation();
    didDrag.current = false;

    const point = viewport.svgPt(e);
    const node = nodes.find((item) => item.id === id);
    if (!node) return;

    dragNode.current = { id, ox: point.x - node.x, oy: point.y - node.y };
  };

  const onCanvasMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const point = viewport.svgPt(e);

    if (routeDrag.current) {
      const value = routeDrag.current.axis === "x" ? point.x : point.y;
      if (Math.abs(value - routeDrag.current.startValue) > 2) {
        routeDrag.current.moved = true;
      }

      setRoutePreview({
        connId: routeDrag.current.connId,
        routing: { axis: routeDrag.current.axis, value },
      });
      return;
    }

    if (connFrom.current) {
      setConnPreview(point);
      return;
    }

    if (dragNode.current) {
      didDrag.current = true;

      const { id, ox, oy } = dragNode.current;
      updateSnapshot((currentSnapshot) =>
        updateNodeInSnapshot(currentSnapshot, id, {
          x: point.x - ox,
          y: point.y - oy,
        }),
      );
      return;
    }

    viewport.updatePan(e);
  };

  const onCanvasMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (routeDrag.current) {
      const point = viewport.svgPt(e);
      const { connId, axis, moved } = routeDrag.current;
      const value = axis === "x" ? point.x : point.y;

      if (moved) {
        updateSnapshot((currentSnapshot) =>
          updateConnectionInSnapshot(currentSnapshot, connId, {
            routing: { axis, value },
          }),
        );
        selection.selectConn(connId);
      }

      clearRoutePreview();
      return;
    }

    dragNode.current = null;
    viewport.stopPan();

    if (connFrom.current) {
      clearConnectionPreview();
    }
  };

  const onSvgMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    if (
      (e.target as Element).closest("[data-node]") ||
      (e.target as Element).closest("[data-conn-route-handle]") ||
      connFrom.current
    ) {
      return;
    }

    viewport.beginPan(e);
  };

  const onSvgClick = (e: MouseEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest("[data-node]")) return;

    if (connFrom.current) {
      clearConnectionPreview();
      return;
    }

    selection.clearSelection();
  };

  const onNodeSelect = (id: string, e: MouseEvent<SVGGElement>) => {
    e.stopPropagation();
    if (suppressNextNodeClick.current) {
      suppressNextNodeClick.current = false;
      return;
    }
    if (didDrag.current) return;

    if (connFrom.current) {
      return;
    }

    selection.toggleNodeSelection(id);
  };

  const onNodeMouseUp = (id: string, e: MouseEvent<SVGGElement>) => {
    if (!connFrom.current) return;

    e.stopPropagation();
    suppressNextNodeClick.current = true;
    createConnection(connFrom.current, id);
  };

  const onNodeMouseEnter = (id: string) => {
    if (!connFrom.current || id === connFrom.current) {
      setHoveredConnectTargetId(null);
      return;
    }

    setHoveredConnectTargetId(id);
  };

  const onNodeMouseLeave = (id: string) => {
    setHoveredConnectTargetId((currentId) => (currentId === id ? null : currentId));
  };

  const onNodeStartConn = (id: string, e: MouseEvent<SVGGElement>) => {
    e.stopPropagation();
    startConnectionFromNode(id);
    setConnPreview(viewport.svgPt(e));
  };

  const onDrop = (e: DragEvent<SVGSVGElement>) => {
    e.preventDefault();

    const type = e.dataTransfer.getData("nodeType") as NodeType;
    if (!type) return;

    const point = viewport.svgPt(e);
    const nodeId = createNodeId();

    updateSnapshot((currentSnapshot) =>
      addNodeToSnapshot(currentSnapshot, createDroppedNode(nodeId, type, point)),
    );

    selection.selectNode(nodeId);
  };

  const onConnRouteDragStart = (
    connId: string,
    axis: ConnRouteAxis,
    e: MouseEvent<SVGCircleElement>,
  ) => {
    if (!editMode) return;

    e.stopPropagation();

    const point = viewport.svgPt(e);
    const startValue = axis === "x" ? point.x : point.y;

    routeDrag.current = {
      connId,
      axis,
      startValue,
      moved: false,
    };
    setRouteDragAxis(axis);
    setRoutePreview({
      connId,
      routing: { axis, value: startValue },
    });
    selection.selectConn(connId);
  };

  return {
    nodes,
    conns,
    selectedNodeId: selection.selectedNodeId,
    editingNode: selection.editingNode,
    selectedConnId: selection.selectedConnId,
    selectedNode: selection.selectedNode,
    selectedConn: selection.selectedConn,
    editMode,
    setEditMode,
    animOn,
    setAnimOn,
    zoom: viewport.zoom,
    pan: viewport.pan,
    showAdd,
    addPos,
    connPreview,
    routePreview,
    sourceNode,
    hoveredConnectTargetId,
    connectingFromId,
    svgRef: viewport.svgRef,
    isPanning: viewport.isPanning,
    isConnecting: Boolean(connectingFromId),
    routeDragAxis,
    openAddDialog,
    closeAddDialog,
    addNode,
    selectNode: selection.selectNode,
    openNodeEditor: selection.openNodeEditor,
    closeNodeEditor: selection.closeNodeEditor,
    selectConn: selection.selectConn,
    updateNode,
    deleteNode,
    duplicateNode,
    updateConn,
    deleteConn,
    centerNode,
    createConnection,
    startConnectionFromNode,
    cancelConnection,
    clearSelection: selection.clearSelection,
    onNodeMouseDown,
    onNodeMouseUp,
    onNodeMouseEnter,
    onNodeMouseLeave,
    onCanvasMouseMove,
    onCanvasMouseUp,
    onSvgMouseDown,
    onSvgClick,
    onConnRouteDragStart,
    onNodeSelect,
    onNodeStartConn,
    onDrop,
    zoomIn: viewport.zoomIn,
    zoomOut: viewport.zoomOut,
    resetViewport: viewport.resetViewport,
  };
}
