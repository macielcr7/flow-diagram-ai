import { T } from "../dashboard-constants";
import { orthPath } from "../dashboard-geometry";
import type { ArchNode, Conn } from "../dashboard-types";

type MiniMapProps = {
  nodes: ArchNode[];
  conns: Conn[];
};

export function MiniMap({ nodes, conns }: MiniMapProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "12px",
        left: "10px",
        width: 152,
        height: 86,
        background: "#0b1628",
        border: "1px solid #1a2d4a",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      <svg width="152" height="86" viewBox="0 0 980 640" style={{ opacity: 0.8 }}>
        {conns.map((conn, index) => {
          const fromNode = nodes.find((node) => node.id === conn.from);
          const toNode = nodes.find((node) => node.id === conn.to);
          if (!fromNode || !toNode) return null;

          const { d } = orthPath(fromNode, toNode, conn);

          return (
            <path
              key={index}
              d={d}
              fill="none"
              stroke={conn.dashed ? "#7c5cbf" : "#3b7dd8"}
              strokeWidth="5"
              opacity="0.45"
            />
          );
        })}
        {nodes.map((node) => (
          <rect
            key={node.id}
            x={node.x}
            y={node.y}
            width={node.w}
            height={node.h}
            rx="3"
            fill={T[node.type].bg}
            stroke={T[node.type].border}
            strokeWidth="3"
            opacity="0.85"
          />
        ))}
      </svg>
    </div>
  );
}
