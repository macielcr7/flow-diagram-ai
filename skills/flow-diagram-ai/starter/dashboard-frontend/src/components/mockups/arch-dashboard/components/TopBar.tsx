import type { AnalysisState } from "../dashboard-types";
import { TopBarActions } from "./top-bar/TopBarActions";
import { TopBarAnalysisStatus } from "./top-bar/TopBarAnalysisStatus";
import { TopBarBrand } from "./top-bar/TopBarBrand";
import { TopBarSnapshotSummary } from "./top-bar/TopBarSnapshotSummary";

type TopBarProps = {
  analysisState: AnalysisState;
  progress: number;
  stats: {
    services: number;
    endpoints: number;
    flows: number;
  };
  activeDiagramName: string;
  snapshotStatus: "draft" | "analyzed";
  snapshotUpdatedAt: string;
  onAnalyze: () => void;
  onOpenSnapshotManager: () => void;
  onOpenExampleCatalog: () => void;
  onOpenSnapshotJson: () => void;
};

export function TopBar({
  analysisState,
  progress,
  stats,
  activeDiagramName,
  snapshotStatus,
  snapshotUpdatedAt,
  onAnalyze,
  onOpenSnapshotManager,
  onOpenExampleCatalog,
  onOpenSnapshotJson,
}: TopBarProps) {
  return (
    <div
      style={{
        background: "#0b1628",
        borderBottom: "1px solid #1a2d4a",
        height: "46px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "0 14px",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      <TopBarBrand />
      <TopBarSnapshotSummary activeDiagramName={activeDiagramName} />

      <div style={{ flex: 1 }} />

      <TopBarAnalysisStatus
        analysisState={analysisState}
        progress={progress}
        stats={stats}
        snapshotStatus={snapshotStatus}
      />
      <TopBarActions
        analysisState={analysisState}
        snapshotUpdatedAt={snapshotUpdatedAt}
        onAnalyze={onAnalyze}
        onOpenSnapshotManager={onOpenSnapshotManager}
        onOpenExampleCatalog={onOpenExampleCatalog}
        onOpenSnapshotJson={onOpenSnapshotJson}
      />
    </div>
  );
}
