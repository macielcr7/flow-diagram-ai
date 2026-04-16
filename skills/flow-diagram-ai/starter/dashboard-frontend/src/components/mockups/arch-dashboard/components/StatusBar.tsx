import { formatDateTime } from "@/shared/formatters/format-date-time";

type StatusBarProps = {
  stats: {
    services: number;
    endpoints: number;
    flows: number;
  };
  snapshotId: string;
  lastAnalyzedAt: string | null;
};

export function StatusBar({
  stats,
  snapshotId,
  lastAnalyzedAt,
}: StatusBarProps) {
  return (
    <div
      style={{
        background: "#0b1628",
        borderTop: "1px solid #1a2d4a",
        height: "26px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "0 14px",
        flexShrink: 0,
      }}
    >
      <span style={{ color: "#334155", fontSize: "9.5px" }}>
        Snapshot: <span style={{ color: "#475569" }}>{snapshotId}</span>
      </span>
      <span style={{ color: "#1a2d4a" }}>·</span>
      <span style={{ color: "#334155", fontSize: "9.5px" }}>
        <span style={{ color: "#60a5fa" }}>{stats.services}</span> services detected
      </span>
      <span style={{ color: "#1a2d4a" }}>·</span>
      <span style={{ color: "#334155", fontSize: "9.5px" }}>
        <span style={{ color: "#a78bfa" }}>{stats.endpoints}</span> endpoints mapped
      </span>
      <span style={{ color: "#1a2d4a" }}>·</span>
      <span style={{ color: "#334155", fontSize: "9.5px" }}>
        <span style={{ color: "#34d399" }}>{stats.flows}</span> flows identified
      </span>
      <span style={{ color: "#1a2d4a" }}>·</span>
      <span style={{ color: "#334155", fontSize: "9.5px" }}>
        Last analysis:{" "}
        <span style={{ color: "#475569" }}>
          {lastAnalyzedAt
            ? formatDateTime(new Date(lastAnalyzedAt))
            : "not analyzed yet"}
        </span>
      </span>
      <div style={{ flex: 1 }} />
      <span style={{ color: "#334155", fontSize: "9px", fontFamily: "monospace" }}>
        FlowChartAI v1.0.0 · by Maciel
      </span>
    </div>
  );
}
