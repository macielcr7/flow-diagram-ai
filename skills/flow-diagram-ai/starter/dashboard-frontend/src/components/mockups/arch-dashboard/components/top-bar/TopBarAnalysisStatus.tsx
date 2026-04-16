import { Pill } from "../TinyHelpers";
import type { AnalysisState } from "../../dashboard-types";

type TopBarAnalysisStatusProps = {
  analysisState: AnalysisState;
  progress: number;
  stats: {
    services: number;
    endpoints: number;
    flows: number;
  };
  snapshotStatus: "draft" | "analyzed";
};

export function TopBarAnalysisStatus({
  analysisState,
  progress,
  stats,
  snapshotStatus,
}: TopBarAnalysisStatusProps) {
  if (analysisState === "scanning") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "#0a1221",
          border: "1px solid #1d4ed8",
          borderRadius: "20px",
          padding: "3px 12px",
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#3b82f6",
            animation: "blink .6s ease-in-out infinite",
          }}
        />
        <span style={{ color: "#60a5fa", fontSize: "10.5px" }}>
          Analyzing snapshot…
        </span>
        <div
          style={{
            width: 60,
            height: 4,
            background: "#1e2d4a",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg,#2563eb,#7c3aed)",
              borderRadius: "2px",
              width: `${progress}%`,
              transition: "width .05s linear",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Pill
        color={snapshotStatus === "analyzed" ? "#22c55e" : "#fbbf24"}
        bg={snapshotStatus === "analyzed" ? "#0a1f0a" : "#23170a"}
        border={snapshotStatus === "analyzed" ? "#14532d" : "#a16207"}
      >
        {snapshotStatus === "analyzed" ? "✔ Snapshot analyzed" : "● Snapshot draft"}
      </Pill>
      <Pill color="#60a5fa" bg="#0a1221" border="#1d4ed8">
        ⬡ {stats.services} Services
      </Pill>
      <Pill color="#a78bfa" bg="#150e29" border="#7c3aed">
        ⎇ {stats.endpoints} Endpoints
      </Pill>
      <Pill color="#34d399" bg="#0a1a14" border="#059669">
        ⟶ {stats.flows} Flows
      </Pill>
    </>
  );
}
