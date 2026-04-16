import type {
  DragEvent as ReactDragEvent,
  MouseEvent as ReactMouseEvent,
  RefObject,
} from "react";

import type { ArchNode, Conn, ConnRouteAxis } from "../dashboard-types";
import { AnalysisScanOverlay } from "./AnalysisScanOverlay";
import { CanvasGrid } from "./CanvasGrid";
import { ConnLine, type ConnLineEmphasis } from "./ConnLine";
import { EditModeHint } from "./EditModeHint";
import { MiniMap } from "./MiniMap";
import { NodeBox, type NodeBoxEmphasis } from "./NodeBox";
import { ZoomControls } from "./ZoomControls";

type DiagramCanvasProps = {
  nodes: ArchNode[];
  conns: Conn[];
  selectedNodeId: string | null;
  selectedConnId: string | null;
  editMode: boolean;
  animOn: boolean;
  analysisScanning: boolean;
  zoom: number;
  pan: { x: number; y: number };
  sourceNode: ArchNode | null;
  hoveredConnectTargetId: string | null;
  connPreview: { x: number; y: number } | null;
  routePreview: { connId: string; routing: NonNullable<Conn["routing"]> } | null;
  svgRef: RefObject<SVGSVGElement | null>;
  isPanning: boolean;
  isConnecting: boolean;
  routeDragAxis: ConnRouteAxis | null;
  onCanvasMouseMove: (e: ReactMouseEvent<HTMLDivElement>) => void;
  onCanvasMouseUp: (e: ReactMouseEvent<HTMLDivElement>) => void;
  onSvgMouseDown: (e: ReactMouseEvent<SVGSVGElement>) => void;
  onSvgClick: (e: ReactMouseEvent<SVGSVGElement>) => void;
  onDrop: (e: ReactDragEvent<SVGSVGElement>) => void;
  onSelectConn: (connId: string) => void;
  onDeleteConn: (connId: string) => void;
  onConnRouteDragStart: (
    connId: string,
    axis: ConnRouteAxis,
    e: ReactMouseEvent<SVGCircleElement>,
  ) => void;
  onNodeMouseDown: (nodeId: string, e: ReactMouseEvent<SVGGElement>) => void;
  onNodeMouseUp: (nodeId: string, e: ReactMouseEvent<SVGGElement>) => void;
  onNodeMouseEnter: (nodeId: string) => void;
  onNodeMouseLeave: (nodeId: string) => void;
  onNodeSelect: (nodeId: string, e: ReactMouseEvent<SVGGElement>) => void;
  onNodeStartConn: (nodeId: string, e: ReactMouseEvent<SVGGElement>) => void;
  onNodeDoubleClick: (nodeId: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetViewport: () => void;
};

export function DiagramCanvas({
  nodes,
  conns,
  selectedNodeId,
  selectedConnId,
  editMode,
  animOn,
  analysisScanning,
  zoom,
  pan,
  sourceNode,
  hoveredConnectTargetId,
  connPreview,
  routePreview,
  svgRef,
  isPanning,
  isConnecting,
  routeDragAxis,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onSvgMouseDown,
  onSvgClick,
  onDrop,
  onSelectConn,
  onDeleteConn,
  onConnRouteDragStart,
  onNodeMouseDown,
  onNodeMouseUp,
  onNodeMouseEnter,
  onNodeMouseLeave,
  onNodeSelect,
  onNodeStartConn,
  onNodeDoubleClick,
  onZoomIn,
  onZoomOut,
  onResetViewport,
}: DiagramCanvasProps) {
  const getConnEmphasis = (conn: Conn): ConnLineEmphasis => {
    if (!selectedNodeId) return "default";
    if (conn.to === selectedNodeId) return "incoming";
    if (conn.from === selectedNodeId) return "outgoing";
    return "muted";
  };

  const getNodeEmphasis = (nodeId: string): NodeBoxEmphasis => {
    if (!selectedNodeId || nodeId === selectedNodeId) return "default";

    const hasIncoming = conns.some(
      (conn) => conn.from === nodeId && conn.to === selectedNodeId,
    );
    const hasOutgoing = conns.some(
      (conn) => conn.from === selectedNodeId && conn.to === nodeId,
    );

    if (hasIncoming && hasOutgoing) return "bidirectional";
    if (hasIncoming) return "incoming";
    if (hasOutgoing) return "outgoing";
    return "muted";
  };

  return (
    <div
      style={{ flex: 1, position: "relative", overflow: "hidden", background: "#07101f" }}
      onMouseMove={onCanvasMouseMove}
      onMouseUp={onCanvasMouseUp}
    >
      <CanvasGrid />
      <AnalysisScanOverlay visible={analysisScanning} />
      <EditModeHint visible={editMode} />

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{
          display: "block",
          cursor: isPanning
            ? "grabbing"
            : routeDragAxis === "x"
              ? "ew-resize"
              : routeDragAxis === "y"
                ? "ns-resize"
                : isConnecting
                  ? "crosshair"
                  : "default",
        }}
        onMouseDown={onSvgMouseDown}
        onClick={onSvgClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {conns.map((conn) => {
            const renderedConn =
              routePreview?.connId === conn.id
                ? { ...conn, routing: routePreview.routing }
                : conn;

            return (
              <ConnLine
                key={conn.id}
                conn={renderedConn}
                nodes={nodes}
                selected={selectedConnId === conn.id}
                emphasis={getConnEmphasis(conn)}
                animOn={animOn}
                editMode={editMode}
                onSelect={() => onSelectConn(conn.id)}
                onDelete={() => onDeleteConn(conn.id)}
                onStartRouteDrag={(axis, e) =>
                  onConnRouteDragStart(conn.id, axis, e)
                }
              />
            );
          })}
          {sourceNode && connPreview && (
            <line
              x1={sourceNode.x + sourceNode.w}
              y1={sourceNode.y + sourceNode.h / 2}
              x2={connPreview.x}
              y2={connPreview.y}
              stroke="#facc15"
              strokeWidth="1.5"
              strokeDasharray="6,4"
              opacity="0.75"
            />
          )}
          {nodes.map((node) => (
            <NodeBox
              key={node.id}
              node={node}
              selected={selectedNodeId === node.id}
              emphasis={getNodeEmphasis(node.id)}
              editMode={editMode}
              connectionSource={sourceNode?.id === node.id}
              connectionTarget={hoveredConnectTargetId === node.id}
              onMouseDown={(e) => onNodeMouseDown(node.id, e)}
              onMouseUp={(e) => onNodeMouseUp(node.id, e)}
              onMouseEnter={() => onNodeMouseEnter(node.id)}
              onMouseLeave={() => onNodeMouseLeave(node.id)}
              onSelect={(e) => onNodeSelect(node.id, e)}
              onStartConn={(e) => onNodeStartConn(node.id, e)}
              onDoubleClick={() => onNodeDoubleClick(node.id)}
            />
          ))}
        </g>
      </svg>

      <ZoomControls
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onReset={onResetViewport}
      />

      <MiniMap nodes={nodes} conns={conns} />
    </div>
  );
}
