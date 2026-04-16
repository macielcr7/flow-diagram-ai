import {
  parseDashboardSnapshot,
  type DashboardSnapshot,
} from "../../dashboard-snapshot";

const LEGACY_SNAPSHOT_STORAGE_KEY = "flow-chart-ai.arch-dashboard.snapshot";
const DASHBOARD_WORKSPACE_STORAGE_KEY =
  "flow-chart-ai.arch-dashboard.workspace";

export type DashboardWorkspaceSnapshotRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  snapshot: DashboardSnapshot;
};

export type DashboardWorkspaceStorage = {
  currentSnapshotId: string;
  snapshots: DashboardWorkspaceSnapshotRecord[];
};

type PersistedWorkspaceSnapshotRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  snapshot: unknown;
};

type PersistedWorkspace = {
  version: 1;
  currentSnapshotId: string;
  snapshots: PersistedWorkspaceSnapshotRecord[];
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function parseWorkspaceRecord(
  input: PersistedWorkspaceSnapshotRecord,
): DashboardWorkspaceSnapshotRecord | null {
  try {
    return {
      id: input.id,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      snapshot: parseDashboardSnapshot(input.snapshot),
    };
  } catch {
    return null;
  }
}

function normalizeWorkspace(
  workspace: DashboardWorkspaceStorage,
): DashboardWorkspaceStorage | null {
  if (workspace.snapshots.length === 0) {
    return null;
  }

  const hasCurrent = workspace.snapshots.some(
    (item) => item.id === workspace.currentSnapshotId,
  );

  return {
    currentSnapshotId: hasCurrent
      ? workspace.currentSnapshotId
      : workspace.snapshots[0].id,
    snapshots: workspace.snapshots,
  };
}

function loadLegacySnapshotFromStorage(): DashboardWorkspaceStorage | null {
  if (!isBrowser()) {
    return null;
  }

  const rawSnapshot = window.localStorage.getItem(LEGACY_SNAPSHOT_STORAGE_KEY);
  if (!rawSnapshot) {
    return null;
  }

  try {
    const snapshot = parseDashboardSnapshot(JSON.parse(rawSnapshot));
    const now = new Date().toISOString();

    return {
      currentSnapshotId: snapshot.meta.id,
      snapshots: [
        {
          id: snapshot.meta.id,
          createdAt: now,
          updatedAt: now,
          snapshot,
        },
      ],
    };
  } catch {
    return null;
  }
}

export function loadDashboardWorkspaceFromStorage():
  | DashboardWorkspaceStorage
  | null {
  if (!isBrowser()) {
    return null;
  }

  const rawWorkspace = window.localStorage.getItem(
    DASHBOARD_WORKSPACE_STORAGE_KEY,
  );

  if (!rawWorkspace) {
    return loadLegacySnapshotFromStorage();
  }

  try {
    const parsedWorkspace = JSON.parse(rawWorkspace) as PersistedWorkspace;
    if (
      parsedWorkspace.version !== 1 ||
      !Array.isArray(parsedWorkspace.snapshots) ||
      typeof parsedWorkspace.currentSnapshotId !== "string"
    ) {
      return loadLegacySnapshotFromStorage();
    }

    const snapshots = parsedWorkspace.snapshots
      .map(parseWorkspaceRecord)
      .filter((item): item is DashboardWorkspaceSnapshotRecord => item !== null);

    return normalizeWorkspace({
      currentSnapshotId: parsedWorkspace.currentSnapshotId,
      snapshots,
    });
  } catch {
    return loadLegacySnapshotFromStorage();
  }
}

export function saveDashboardWorkspaceToStorage(
  workspace: DashboardWorkspaceStorage,
): void {
  if (!isBrowser()) {
    return;
  }

  const normalizedWorkspace = normalizeWorkspace(workspace);
  if (!normalizedWorkspace) {
    clearDashboardWorkspaceFromStorage();
    return;
  }

  const persistedWorkspace: PersistedWorkspace = {
    version: 1,
    currentSnapshotId: normalizedWorkspace.currentSnapshotId,
    snapshots: normalizedWorkspace.snapshots,
  };

  window.localStorage.setItem(
    DASHBOARD_WORKSPACE_STORAGE_KEY,
    JSON.stringify(persistedWorkspace),
  );
  window.localStorage.removeItem(LEGACY_SNAPSHOT_STORAGE_KEY);
}

export function clearDashboardWorkspaceFromStorage(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(DASHBOARD_WORKSPACE_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_SNAPSHOT_STORAGE_KEY);
}
