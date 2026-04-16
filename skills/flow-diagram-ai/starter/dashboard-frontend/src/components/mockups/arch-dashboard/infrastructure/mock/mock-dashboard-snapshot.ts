import registeredDashboardSnapshotJson from "./dashboard-snapshot.json";

import {
  cloneDashboardSnapshot,
  parseDashboardSnapshot,
  type DashboardSnapshot,
} from "../../dashboard-snapshot";

const registeredDashboardSnapshot = parseDashboardSnapshot(
  registeredDashboardSnapshotJson,
);

export function getRegisteredMockDashboardSnapshot(): DashboardSnapshot {
  return cloneDashboardSnapshot(registeredDashboardSnapshot);
}

