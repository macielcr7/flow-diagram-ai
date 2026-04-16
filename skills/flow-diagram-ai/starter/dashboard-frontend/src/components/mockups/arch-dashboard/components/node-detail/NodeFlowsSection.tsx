import { T } from "../../dashboard-constants";
import type { ArchNode, Conn } from "../../dashboard-types";

type NodeFlow = {
  conn: Conn;
  node: ArchNode;
};

function FlowList({
  title,
  flows,
}: {
  title: string;
  flows: NodeFlow[];
}) {
  if (flows.length === 0) return null;

  return (
    <div style={{ marginBottom: title === "↙ INCOMING" ? "5px" : undefined }}>
      <div
        style={{ color: "#334155", fontSize: "8px", fontWeight: 700, marginBottom: "3px" }}
      >
        {title}
      </div>
      {flows.map(({ conn, node }, index) => (
        <div
          key={index}
          style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: T[node.type].top,
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          <span
            style={{
              color: "#64748b",
              fontSize: "9px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {node.label}
          </span>
          <span
            style={{
              color: "#334155",
              fontSize: "8px",
              fontFamily: "monospace",
              flexShrink: 0,
            }}
          >
            · {conn.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function NodeFlowsSection({
  incoming,
  outgoing,
}: {
  incoming: NodeFlow[];
  outgoing: NodeFlow[];
}) {
  if (incoming.length === 0 && outgoing.length === 0) return null;

  return (
    <div style={{ padding: "8px 10px", borderBottom: "1px solid #1a2d4a" }}>
      <div
        style={{
          color: "#475569",
          fontSize: "9px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          marginBottom: "6px",
        }}
      >
        Flows
      </div>
      <FlowList title="↙ INCOMING" flows={incoming} />
      <FlowList title="↗ OUTGOING" flows={outgoing} />
    </div>
  );
}
