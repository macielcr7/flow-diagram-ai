import { useState } from "react";

import {
  calculateAnalysisStatsFromSnapshot,
  type DashboardSnapshot,
} from "./dashboard-snapshot";
import type { AnalysisState } from "./dashboard-types";

export function useAnalysis(
  snapshot: DashboardSnapshot,
  applyAnalysisResult: (analysis: DashboardSnapshot["analysis"]) => void,
) {
  const [state, setState] = useState<AnalysisState>("done");
  const [progress, setProgress] = useState(100);
  const stats = snapshot.analysis.stats;

  const run = () => {
    setState("scanning");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setState("done");
          applyAnalysisResult({
            source: "mock",
            lastAnalyzedAt: new Date().toISOString(),
            stats: calculateAnalysisStatsFromSnapshot(snapshot),
          });
          return 100;
        }
        return p + 2;
      });
    }, 40);
  };

  return { state, progress, stats, run };
}
