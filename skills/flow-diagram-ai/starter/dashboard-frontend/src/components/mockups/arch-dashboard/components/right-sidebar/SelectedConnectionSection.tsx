import type { ArchNode, Conn } from "../../dashboard-types";
import { Sec } from "../TinyHelpers";
import { actionButtonStyles } from "./right-sidebar-styles";

type SelectedConnectionSectionProps = {
  conn: Conn;
  nodes: ArchNode[];
  onDelete: () => void;
};

export function SelectedConnectionSection({
  conn,
  nodes,
  onDelete,
}: SelectedConnectionSectionProps) {
  const source = nodes.find((node) => node.id === conn.from);
  const target = nodes.find((node) => node.id === conn.to);

  return (
    <Sec label="LINK" sub={conn.label || "selected"}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          color: "#94a3b8",
          fontSize: "10px",
        }}
      >
        <div
          style={{
            border: "1px solid #1a2d4a",
            borderRadius: "6px",
            background: "#0a1221",
            padding: "8px",
          }}
        >
          <div style={{ color: "#e2e8f0", fontWeight: 600 }}>
            {source?.label ?? conn.from} → {target?.label ?? conn.to}
          </div>
          <div style={{ color: "#64748b", marginTop: "4px" }}>
            {conn.dashed ? "Asynchronous flow" : "Direct flow"}
          </div>
        </div>
        <button
          onClick={onDelete}
          style={actionButtonStyles("#1f0b0b", "#7f1d1d", "#fca5a5")}
          type="button"
        >
          Delete link
        </button>
      </div>
    </Sec>
  );
}
