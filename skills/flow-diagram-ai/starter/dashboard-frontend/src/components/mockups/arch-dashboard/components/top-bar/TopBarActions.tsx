import { formatDateTime } from "@/shared/formatters/format-date-time";

import type { AnalysisState } from "../../dashboard-types";

type TopBarActionsProps = {
  analysisState: AnalysisState;
  snapshotUpdatedAt: string;
  onAnalyze: () => void;
  onOpenSnapshotManager: () => void;
  onOpenExampleCatalog: () => void;
  onOpenSnapshotJson: () => void;
};

export function TopBarActions({
  analysisState,
  snapshotUpdatedAt,
  onAnalyze,
  onOpenSnapshotManager,
  onOpenExampleCatalog,
  onOpenSnapshotJson,
}: TopBarActionsProps) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#22c55e",
            display: "inline-block",
            animation: "blink 2s ease-in-out infinite",
          }}
        />
        <span style={{ color: "#64748b", fontSize: "10px" }}>
          Updated {formatDateTime(new Date(snapshotUpdatedAt))}
        </span>
      </div>

      <button
        onClick={onOpenSnapshotManager}
        style={{
          background: "#0f172a",
          border: "1px solid #0f766e",
          borderRadius: "6px",
          color: "#99f6e4",
          fontSize: "10.5px",
          padding: "5px 11px",
          cursor: "pointer",
          fontWeight: 600,
        }}
        type="button"
      >
        Snapshots
      </button>

      <button
        onClick={onOpenExampleCatalog}
        style={{
          background: "#0f172a",
          border: "1px solid #7c3aed",
          borderRadius: "6px",
          color: "#d8b4fe",
          fontSize: "10.5px",
          padding: "5px 11px",
          cursor: "pointer",
          fontWeight: 600,
        }}
        type="button"
      >
        Load Example
      </button>

      <button
        onClick={onOpenSnapshotJson}
        style={{
          background: "#0f172a",
          border: "1px solid #1e3a5f",
          borderRadius: "6px",
          color: "#cbd5e1",
          fontSize: "10.5px",
          padding: "5px 11px",
          cursor: "pointer",
          fontWeight: 600,
        }}
        type="button"
      >
        Edit JSON
      </button>

      <button
        onClick={onAnalyze}
        disabled={analysisState === "scanning"}
        type="button"
        style={{
          background:
            analysisState === "scanning"
              ? "#0f172a"
              : "linear-gradient(135deg,#1d4ed8,#7c3aed)",
          border: "none",
          borderRadius: "6px",
          color: "#fff",
          fontSize: "10.5px",
          padding: "5px 11px",
          cursor: analysisState === "scanning" ? "not-allowed" : "pointer",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "5px",
          opacity: analysisState === "scanning" ? 0.5 : 1,
        }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Analyze Snapshot
      </button>
    </>
  );
}
