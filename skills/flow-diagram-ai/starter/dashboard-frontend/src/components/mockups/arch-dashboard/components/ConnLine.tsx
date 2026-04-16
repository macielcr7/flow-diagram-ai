import type { MouseEvent as ReactMouseEvent } from "react";

import { orthPath } from "../dashboard-geometry";
import type { ArchNode, Conn, ConnRouteAxis } from "../dashboard-types";

export type ConnLineEmphasis = "default" | "incoming" | "outgoing" | "muted";

type ConnLineProps = {
  conn: Conn;
  nodes: ArchNode[];
  selected: boolean;
  emphasis: ConnLineEmphasis;
  animOn: boolean;
  editMode: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onStartRouteDrag: (
    axis: ConnRouteAxis,
    e: ReactMouseEvent<SVGCircleElement>,
  ) => void;
};

export function ConnLine({
  conn,
  nodes,
  selected,
  emphasis,
  animOn,
  editMode,
  onSelect,
  onDelete,
  onStartRouteDrag,
}: ConnLineProps) {
  const fn = nodes.find((node) => node.id === conn.from);
  const tn = nodes.find((node) => node.id === conn.to);
  if (!fn || !tn) return null;

  const { d, lx, ly, ex, ey, handleX, handleY, dragAxis } = orthPath(fn, tn, conn);
  const isHighlighted = emphasis === "incoming" || emphasis === "outgoing";
  const strokeC = selected
    ? "#facc15"
    : emphasis === "incoming"
      ? "#60a5fa"
      : emphasis === "outgoing"
        ? "#f472b6"
        : conn.dashed
          ? "#7c5cbf"
          : "#3b7dd8";
  const mid = `arrow-${conn.id}`;
  const dash = "10,7";
  const baseStrokeOpacity = selected
    ? 0.96
    : emphasis === "muted"
      ? 0.18
      : isHighlighted
        ? 0.94
        : 0.78;
  const animatedStrokeOpacity = selected
    ? 0.98
    : emphasis === "muted"
      ? 0.2
      : isHighlighted
        ? 0.96
        : 0.92;
  const markerOpacity = emphasis === "muted" ? 0.82 : 0.92;
  const labelStroke = selected || isHighlighted ? strokeC : "#1e2d4a";
  const labelFill = selected
    ? "#facc15"
    : isHighlighted
      ? strokeC
      : emphasis === "muted"
        ? "#475569"
        : "#64748b";
  const labelOpacity = emphasis === "muted" ? 0.76 : 0.92;

  const handleSelect = (e: ReactMouseEvent<SVGElement>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <g>
      <defs>
        <marker
          id={mid}
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L0,7 L10,3.5 z" fill={strokeC} opacity={markerOpacity} />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth="24"
        style={{ cursor: "pointer" }}
        onMouseDown={handleSelect}
        onClick={handleSelect}
      />
      {(selected || isHighlighted) && (
        <path
          d={d}
          fill="none"
          stroke={strokeC}
          strokeWidth={selected ? 6 : 4.5}
          strokeOpacity={selected ? 0.18 : 0.16}
          style={{ filter: "blur(4px)" }}
        />
      )}
      <path
        d={d}
        fill="none"
        stroke={strokeC}
        strokeWidth={conn.dashed ? 1.3 : 1.6}
        strokeDasharray={conn.dashed ? dash : undefined}
        strokeOpacity={animOn ? Math.min(baseStrokeOpacity, 0.28) : baseStrokeOpacity}
        markerEnd={animOn ? undefined : `url(#${mid})`}
        style={{ cursor: "pointer" }}
        onMouseDown={handleSelect}
        onClick={handleSelect}
      />
      {animOn && (
        <path
          d={d}
          fill="none"
          stroke={strokeC}
          strokeWidth={conn.dashed ? 1.4 : 1.8}
          strokeDasharray={dash}
          strokeOpacity={animatedStrokeOpacity}
          markerEnd={`url(#${mid})`}
          style={{
            cursor: "pointer",
            animation: `${conn.dashed ? "flowDashSlow" : "flowDash"} ${
              conn.dashed ? "1.6s" : "1s"
            } linear infinite`,
          }}
          onMouseDown={handleSelect}
          onClick={handleSelect}
        />
      )}
      {conn.label && (
        <g
          transform={`translate(${lx},${ly})`}
          style={{ cursor: "pointer" }}
          onMouseDown={handleSelect}
          onClick={handleSelect}
        >
          <rect
            x="-20"
            y="-8"
            width="40"
            height="14"
            rx="3"
            fill="#07101f"
            stroke={labelStroke}
            strokeWidth="0.8"
            opacity={labelOpacity}
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill={labelFill}
            fontSize="8.5"
            fontFamily="monospace"
            style={{ userSelect: "none" }}
          >
            {conn.label}
          </text>
        </g>
      )}
      <circle
        cx={ex}
        cy={ey}
        r="14"
        fill="transparent"
        style={{ cursor: "pointer" }}
        onMouseDown={handleSelect}
        onClick={handleSelect}
      />
      {selected && editMode && (
        <g>
          <circle
            cx={handleX}
            cy={handleY}
            r="16"
            fill="transparent"
            data-conn-route-handle="true"
            style={{ cursor: dragAxis === "x" ? "ew-resize" : "ns-resize" }}
            onMouseDown={(e) => onStartRouteDrag(dragAxis, e)}
            onClick={(e) => e.stopPropagation()}
          />
          <circle
            cx={handleX}
            cy={handleY}
            r="7"
            fill="#0f172a"
            stroke="#facc15"
            strokeWidth="1.4"
            strokeDasharray={conn.routing ? undefined : "2 2"}
            opacity="0.96"
            data-conn-route-handle="true"
            style={{ cursor: dragAxis === "x" ? "ew-resize" : "ns-resize" }}
            onMouseDown={(e) => onStartRouteDrag(dragAxis, e)}
            onClick={(e) => e.stopPropagation()}
          />
        </g>
      )}
      {selected && (
        <g
          transform={`translate(${lx + 26},${ly - 8})`}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <circle r="8" fill="#450a0a" stroke="#dc2626" strokeWidth="1" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#f87171"
            fontSize="11"
            fontWeight="700"
          >
            ×
          </text>
        </g>
      )}
    </g>
  );
}
