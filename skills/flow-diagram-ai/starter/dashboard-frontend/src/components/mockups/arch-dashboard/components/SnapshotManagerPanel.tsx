import { useMemo, useState } from "react";

import { formatDateTime } from "@/shared/formatters/format-date-time";

import type { WorkspaceSnapshotSummary } from "../use-dashboard-snapshot";

type SnapshotManagerPanelProps = {
  items: WorkspaceSnapshotSummary[];
  activeWorkspaceSnapshotId: string;
  onCreateSnapshot: () => void;
  onSwitchSnapshot: (workspaceId: string) => void;
  onRenameSnapshot: (workspaceId: string, nextName: string) => void;
  onDuplicateSnapshot: (workspaceId: string) => void;
  onDeleteSnapshot: (workspaceId: string) => void;
  onClose: () => void;
};

export function SnapshotManagerPanel({
  items,
  activeWorkspaceSnapshotId,
  onCreateSnapshot,
  onSwitchSnapshot,
  onRenameSnapshot,
  onDuplicateSnapshot,
  onDeleteSnapshot,
  onClose,
}: SnapshotManagerPanelProps) {
  const activeItem = useMemo(
    () => items.find((item) => item.workspaceId === activeWorkspaceSnapshotId) ?? items[0],
    [activeWorkspaceSnapshotId, items],
  );
  const [editingId, setEditingId] = useState<string | null>(activeItem?.workspaceId ?? null);
  const [nameDraft, setNameDraft] = useState(activeItem?.name ?? "");

  const startRename = (workspaceId: string, currentName: string) => {
    setEditingId(workspaceId);
    setNameDraft(currentName);
  };

  const handleSaveRename = () => {
    if (!editingId) return;

    onRenameSnapshot(editingId, nameDraft);
    setEditingId(null);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "16px",
        right: "214px",
        width: "460px",
        background: "#0d1828",
        border: "1px solid #1d4ed8",
        borderRadius: "12px",
        padding: "14px",
        zIndex: 240,
        boxShadow: "0 12px 42px #00000099",
        animation: "fadeIn .15s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div>
          <div style={{ color: "#93c5fd", fontSize: "12px", fontWeight: 700 }}>
            Snapshot Manager
          </div>
          <div style={{ color: "#475569", fontSize: "10px", marginTop: "3px" }}>
            Switch and manage local workspace snapshots.
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#475569",
            cursor: "pointer",
            fontSize: "16px",
            lineHeight: 1,
          }}
          type="button"
        >
          ×
        </button>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button
          onClick={onCreateSnapshot}
          style={panelButtonStyles("#14532d", "#22c55e", "#bbf7d0")}
          type="button"
        >
          New snapshot
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          maxHeight: "520px",
          overflowY: "auto",
          paddingRight: "2px",
        }}
      >
        {items.map((item) => {
          const isActive = item.workspaceId === activeWorkspaceSnapshotId;
          const isEditing = item.workspaceId === editingId;
          const canDelete = items.length > 1;

          return (
            <div
              key={item.workspaceId}
              style={{
                border: `1px solid ${isActive ? "#2563eb" : "#1a2d4a"}`,
                borderRadius: "10px",
                background: isActive ? "#0f1f38" : "#0a1221",
                padding: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  {isEditing ? (
                    <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                      <input
                        value={nameDraft}
                        onChange={(event) => setNameDraft(event.target.value)}
                        style={{
                          flex: 1,
                          background: "#07101f",
                          border: "1px solid #1e3a5f",
                          borderRadius: "6px",
                          color: "#e2e8f0",
                          fontSize: "10.5px",
                          padding: "7px 8px",
                        }}
                      />
                      <button
                        onClick={handleSaveRename}
                        style={panelButtonStyles("#0f172a", "#1d4ed8", "#93c5fd")}
                        type="button"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div style={{ color: "#e2e8f0", fontSize: "11px", fontWeight: 600 }}>
                      {item.name}
                    </div>
                  )}

                  <div style={{ color: "#64748b", fontSize: "9.5px", marginTop: "4px" }}>
                    {item.snapshotId} · {item.systemSlug || "no-slug"}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginTop: "8px",
                      color: "#94a3b8",
                      fontSize: "9.5px",
                    }}
                  >
                    <span>{item.status}</span>
                    <span>Updated {formatDateTime(new Date(item.updatedAt))}</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <button
                    onClick={() => onSwitchSnapshot(item.workspaceId)}
                    style={panelButtonStyles(
                      isActive ? "#1d4ed8" : "#0f172a",
                      isActive ? "#2563eb" : "#1e3a5f",
                      isActive ? "#dbeafe" : "#cbd5e1",
                    )}
                    type="button"
                  >
                    {isActive ? "Active" : "Open"}
                  </button>
                  <button
                    onClick={() => startRename(item.workspaceId, item.name)}
                    style={panelButtonStyles("#0f172a", "#1a2d4a", "#cbd5e1")}
                    type="button"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => onDuplicateSnapshot(item.workspaceId)}
                    style={panelButtonStyles("#0f172a", "#1a2d4a", "#cbd5e1")}
                    type="button"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => onDeleteSnapshot(item.workspaceId)}
                    disabled={!canDelete}
                    style={panelButtonStyles(
                      canDelete ? "#1f0b0b" : "#111827",
                      canDelete ? "#7f1d1d" : "#1f2937",
                      canDelete ? "#fca5a5" : "#475569",
                    )}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function panelButtonStyles(
  background: string,
  border: string,
  color: string,
) {
  return {
    background,
    border: `1px solid ${border}`,
    borderRadius: "6px",
    color,
    fontSize: "10px",
    fontWeight: 600,
    padding: "7px 10px",
    cursor: "pointer",
  } as const;
}
