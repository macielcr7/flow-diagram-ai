import { useState } from "react";

import type { Conn } from "../../dashboard-types";
import {
  FloatingPanel,
  PanelButton,
  PanelField,
} from "./panel-primitives";
import { INPUT_STYLE } from "./panel-styles";

export function ConnEditPanel({
  conn,
  onUpdate,
  onDelete,
  onClose,
}: {
  conn: Conn;
  onUpdate: (p: Partial<Conn>) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(conn.label);
  const [dashed, setDashed] = useState(conn.dashed);

  return (
    <FloatingPanel
      title="Edit Connection"
      borderColor="#7c3aed"
      titleColor="#c4b5fd"
      onClose={onClose}
    >
      <PanelField label="Label">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={INPUT_STYLE}
        />
      </PanelField>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          marginBottom: "8px",
        }}
      >
        <input
          type="checkbox"
          checked={dashed}
          onChange={(e) => setDashed(e.target.checked)}
        />
        <span style={{ color: "#94a3b8", fontSize: "11px" }}>Dashed (async)</span>
      </label>
      <div
        style={{
          color: conn.routing ? "#cbd5e1" : "#64748b",
          fontSize: "11px",
          marginBottom: "8px",
          fontFamily: "monospace",
        }}
      >
        Route: {conn.routing ? `manual (${conn.routing.axis.toUpperCase()}=${Math.round(conn.routing.value)})` : "auto"}
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        <PanelButton full onClick={() => onUpdate({ label, dashed })}>
          Save
        </PanelButton>
        <PanelButton
          full
          color="#111827"
          border="#334155"
          text="#cbd5e1"
          onClick={() => onUpdate({ routing: undefined })}
        >
          Reset route
        </PanelButton>
        <PanelButton
          full
          color="#450a0a"
          border="#dc2626"
          text="#f87171"
          onClick={onDelete}
        >
          Delete
        </PanelButton>
      </div>
    </FloatingPanel>
  );
}
