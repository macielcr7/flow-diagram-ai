import { useState } from "react";

import { ALL_TYPES, NODE_TYPE_LABELS } from "../../dashboard-constants";
import type { ArchNode, NodeType } from "../../dashboard-types";
import {
  FloatingPanel,
  PanelButton,
  PanelField,
} from "./panel-primitives";
import { INPUT_STYLE } from "./panel-styles";

export function NodeEditPanel({
  node,
  onUpdate,
  onDelete,
  onClose,
}: {
  node: ArchNode;
  onUpdate: (p: Partial<ArchNode>) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(node.label);
  const [tech, setTech] = useState(node.tech);
  const [type, setType] = useState<NodeType>(node.type);
  const [ops, setOps] = useState(node.ops.join(", "));

  const save = () =>
    onUpdate({
      label,
      tech,
      type,
      sublabel: type,
      ops: ops
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    });

  return (
    <FloatingPanel
      title="Edit Node"
      borderColor="#2563eb"
      titleColor="#93c5fd"
      onClose={onClose}
    >
      <PanelField label="Label">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={INPUT_STYLE}
        />
      </PanelField>
      <PanelField label="Tech">
        <input
          value={tech}
          onChange={(e) => setTech(e.target.value)}
          style={INPUT_STYLE}
        />
      </PanelField>
      <PanelField label="Type">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as NodeType)}
          style={{ ...INPUT_STYLE, cursor: "pointer" }}
        >
          {ALL_TYPES.map((itemType) => (
            <option key={itemType} value={itemType}>
              {NODE_TYPE_LABELS[itemType]}
            </option>
          ))}
        </select>
      </PanelField>
      <PanelField label="Ops (comma-separated)">
        <input
          value={ops}
          onChange={(e) => setOps(e.target.value)}
          style={INPUT_STYLE}
        />
      </PanelField>
      <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
        <PanelButton full onClick={save}>
          Save
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
