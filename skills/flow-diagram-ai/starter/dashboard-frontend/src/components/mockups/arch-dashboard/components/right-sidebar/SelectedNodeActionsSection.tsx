import type { ArchNode } from "../../dashboard-types";
import { Sec } from "../TinyHelpers";
import { actionButtonStyles } from "./right-sidebar-styles";

type SelectedNodeActionsSectionProps = {
  node: ArchNode;
  onEdit: () => void;
  onDuplicate: () => void;
  onCenter: () => void;
  onDelete: () => void;
};

export function SelectedNodeActionsSection({
  node,
  onEdit,
  onDuplicate,
  onCenter,
  onDelete,
}: SelectedNodeActionsSectionProps) {
  return (
    <Sec label="NODE ACTIONS" sub={node.label}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <button
          onClick={onEdit}
          style={actionButtonStyles("#0f172a", "#1d4ed8", "#93c5fd")}
          type="button"
        >
          Open component editor
        </button>
        <button onClick={onDuplicate} style={actionButtonStyles()} type="button">
          Duplicate component
        </button>
        <button onClick={onCenter} style={actionButtonStyles()} type="button">
          Center in canvas
        </button>
        <button
          onClick={onDelete}
          style={actionButtonStyles("#1f0b0b", "#7f1d1d", "#fca5a5")}
          type="button"
        >
          Delete component
        </button>
      </div>
    </Sec>
  );
}
