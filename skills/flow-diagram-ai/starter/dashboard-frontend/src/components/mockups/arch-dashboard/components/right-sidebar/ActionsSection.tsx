import { Sec } from "../TinyHelpers";
import { actionButtonStyles } from "./right-sidebar-styles";

export function ActionsSection({
  onOpenAddNode,
  onOpenSnapshotJson,
  onResetViewport,
  onClearSelection,
}: {
  onOpenAddNode: () => void;
  onOpenSnapshotJson: () => void;
  onResetViewport: () => void;
  onClearSelection: () => void;
}) {
  return (
    <Sec label="ACTIONS" right="−">
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <button onClick={onOpenAddNode} style={actionButtonStyles()} type="button">
          Add component
        </button>
        <button
          onClick={onOpenSnapshotJson}
          style={actionButtonStyles()}
          type="button"
        >
          Open JSON editor
        </button>
        <button
          onClick={onResetViewport}
          style={actionButtonStyles()}
          type="button"
        >
          Reset view
        </button>
        <button
          onClick={onClearSelection}
          style={actionButtonStyles()}
          type="button"
        >
          Clear selection
        </button>
      </div>
    </Sec>
  );
}
