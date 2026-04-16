import { ICONS, T } from "../../dashboard-constants";
import type { ArchNode } from "../../dashboard-types";

export function NodeDetailHeader({ node }: { node: ArchNode }) {
  return (
    <div style={{ padding: "10px 10px 8px", borderBottom: "1px solid #1a2d4a" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
        <span style={{ fontSize: "14px" }}>{ICONS[node.type]}</span>
        <span style={{ color: "#e2e8f0", fontSize: "11px", fontWeight: 700 }}>
          {node.label}
        </span>
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        <span
          style={{
            background: T[node.type].badgeBg,
            color: T[node.type].badgeFg,
            fontSize: "8px",
            padding: "1px 6px",
            borderRadius: "3px",
            fontFamily: "monospace",
            fontWeight: 700,
            border: `1px solid ${T[node.type].border}`,
          }}
        >
          {node.sublabel}
        </span>
        <span
          style={{
            background: "#1e293b",
            color: "#64748b",
            fontSize: "8px",
            padding: "1px 6px",
            borderRadius: "3px",
            fontFamily: "monospace",
            border: "1px solid #334155",
          }}
        >
          {node.tech}
        </span>
      </div>
    </div>
  );
}
