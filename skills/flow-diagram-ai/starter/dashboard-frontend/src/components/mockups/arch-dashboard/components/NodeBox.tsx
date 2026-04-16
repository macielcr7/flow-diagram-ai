import type { MouseEvent as ReactMouseEvent } from "react";

import { ICONS, T } from "../dashboard-constants";
import type { ArchNode } from "../dashboard-types";

export type NodeBoxEmphasis =
  | "default"
  | "incoming"
  | "outgoing"
  | "bidirectional"
  | "muted";

type NodeBoxProps = {
  node: ArchNode;
  selected: boolean;
  emphasis: NodeBoxEmphasis;
  editMode: boolean;
  connectionSource: boolean;
  connectionTarget: boolean;
  onMouseDown: (e: ReactMouseEvent<SVGGElement>) => void;
  onMouseUp: (e: ReactMouseEvent<SVGGElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onSelect: (e: ReactMouseEvent<SVGGElement>) => void;
  onStartConn: (e: ReactMouseEvent<SVGGElement>) => void;
  onDoubleClick: () => void;
};

export function NodeBox({
  node,
  selected,
  emphasis,
  editMode,
  connectionSource,
  connectionTarget,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
  onMouseLeave,
  onSelect,
  onStartConn,
  onDoubleClick,
}: NodeBoxProps) {
  const t = T[node.type];
  const isLinked = emphasis === "incoming" || emphasis === "outgoing" || emphasis === "bidirectional";
  const borderColor = connectionSource
    ? "#facc15"
    : selected
      ? "#60a5fa"
      : emphasis === "incoming"
        ? "#60a5fa"
        : emphasis === "outgoing"
          ? "#f472b6"
          : emphasis === "bidirectional"
            ? "#c084fc"
            : t.border;
  const glowColor = selected
    ? "#60a5fa"
    : emphasis === "incoming"
      ? "#60a5fa"
      : emphasis === "outgoing"
        ? "#f472b6"
        : "#c084fc";
  const groupOpacity = emphasis === "muted" ? 0.3 : 1;
  const contentOpacity = emphasis === "muted" ? 0.72 : 1;

  return (
    <g
      transform={`translate(${node.x},${node.y})`}
      data-node={node.id}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      style={{ cursor: editMode ? "grab" : "default", opacity: groupOpacity }}
    >
      {selected && (
        <rect
          x="-4"
          y="-4"
          width={node.w + 8}
          height={node.h + 8}
          rx="10"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
          strokeOpacity="0.5"
          style={{ filter: "blur(2px)" }}
        />
      )}
      {!selected && isLinked && (
        <rect
          x="-4"
          y="-4"
          width={node.w + 8}
          height={node.h + 8}
          rx="10"
          fill="none"
          stroke={glowColor}
          strokeWidth="2"
          strokeOpacity="0.34"
          style={{ filter: "blur(2px)" }}
        />
      )}
      {connectionTarget && (
        <rect
          x="-6"
          y="-6"
          width={node.w + 12}
          height={node.h + 12}
          rx="12"
          fill="none"
          stroke="#facc15"
          strokeWidth="2"
          strokeOpacity="0.95"
          strokeDasharray="8 4"
        />
      )}
      <rect
        width={node.w}
        height={node.h}
        rx="7"
        fill={t.bg}
        stroke={borderColor}
        strokeWidth={connectionSource || selected || isLinked ? 1.6 : 1}
        strokeOpacity="0.65"
      />
      <rect width={node.w} height={3.5} rx="2" fill={t.top} opacity={emphasis === "muted" ? 0.6 : 0.9} />
      <foreignObject x="0" y="3" width={node.w} height={node.h - 3}>
        <div
          style={{
            padding: "6px 9px",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            fontFamily: "'Inter', sans-serif",
            height: "100%",
            userSelect: "none",
            opacity: contentOpacity,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontSize: "12px", flexShrink: 0 }}>
              {ICONS[node.type]}
            </span>
            <span
              style={{
                color: "#e2e8f0",
                fontSize: "11px",
                fontWeight: 600,
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {node.label}
            </span>
          </div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            <span
              style={{
                background: t.badgeBg,
                color: t.badgeFg,
                fontSize: "8px",
                padding: "1px 5px",
                borderRadius: "3px",
                fontFamily: "monospace",
                fontWeight: 700,
                border: `1px solid ${t.border}`,
              }}
            >
              {node.sublabel}
            </span>
            <span
              style={{
                background: "#1e293b",
                color: "#64748b",
                fontSize: "8px",
                padding: "1px 5px",
                borderRadius: "3px",
                fontFamily: "monospace",
                border: "1px solid #334155",
              }}
            >
              {node.tech}
            </span>
          </div>
          {node.ops.length > 0 && (
            <div style={{ display: "flex", gap: "2px", flexWrap: "wrap", marginTop: "1px" }}>
              {node.ops.slice(0, 4).map((op) => (
                <span
                  key={op}
                  style={{
                    background: "#0f172a",
                    color: "#475569",
                    fontSize: "7px",
                    padding: "0 3px",
                    borderRadius: "2px",
                    fontFamily: "monospace",
                  }}
                >
                  {op}
                </span>
              ))}
            </div>
          )}
        </div>
      </foreignObject>
      {editMode && (
        <g
          transform={`translate(${node.w - 10},${node.h / 2})`}
          onMouseDown={(e) => {
            e.stopPropagation();
            onStartConn(e);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{ cursor: "crosshair" }}
        >
          <circle
            r="8"
            fill="#1d4ed8"
            stroke="#60a5fa"
            strokeWidth="1.2"
            opacity={emphasis === "muted" ? 0.6 : 0.85}
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill="#93c5fd"
            fontSize="10"
            fontWeight="700"
            opacity={emphasis === "muted" ? 0.72 : 1}
          >
            →
          </text>
        </g>
      )}
    </g>
  );
}
