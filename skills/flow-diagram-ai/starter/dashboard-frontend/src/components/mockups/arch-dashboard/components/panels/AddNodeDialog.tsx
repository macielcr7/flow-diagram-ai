import { useState } from "react";

import { ALL_TYPES, NODE_TYPE_LABELS } from "../../dashboard-constants";
import type { ArchNode, NodeType } from "../../dashboard-types";
import {
  FloatingPanel,
  PanelButton,
  PanelField,
} from "./panel-primitives";
import { INPUT_STYLE } from "./panel-styles";

export function AddNodeDialog({
  pos,
  onAdd,
  onClose,
}: {
  pos: { x: number; y: number };
  onAdd: (node: Omit<ArchNode, "id">) => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState("New Service");
  const [tech, setTech] = useState("Node.js");
  const [type, setType] = useState<NodeType>("SERVICE");

  return (
    <FloatingPanel
      title="Add Node"
      borderColor="#22c55e"
      titleColor="#86efac"
      onClose={onClose}
      style={{ top: "60px", left: "50%", transform: "translateX(-50%)" }}
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
      <PanelButton
        full
        color="#14532d"
        border="#22c55e"
        text="#86efac"
        onClick={() => {
          onAdd({
            label,
            sublabel: type,
            type,
            tech,
            x: pos.x,
            y: pos.y,
            w: 165,
            h: 92,
            ops: [],
          });
          onClose();
        }}
      >
        Add Node
      </PanelButton>
    </FloatingPanel>
  );
}
