import { useEffect, useMemo, useState } from "react";

import { downloadTextFile } from "@/shared/browser/download-text-file";
import { readTextFile } from "@/shared/browser/read-text-file";

import {
  formatDashboardSnapshotError,
  parseDashboardSnapshotText,
  stringifyDashboardSnapshot,
  touchDashboardSnapshot,
  type DashboardSnapshot,
  type DashboardSnapshotAnalysis,
  type DashboardSnapshotStatus,
} from "./dashboard-snapshot";
import {
  getDashboardExampleCatalog,
  getDashboardExampleSnapshot,
  type DashboardExampleCatalogItem,
} from "./infrastructure/examples/dashboard-example-catalog";
import {
  clearDashboardWorkspaceFromStorage,
  loadDashboardWorkspaceFromStorage,
  saveDashboardWorkspaceToStorage,
  type DashboardWorkspaceSnapshotRecord,
  type DashboardWorkspaceStorage,
} from "./infrastructure/local/dashboard-local-snapshot-storage";
import { getRegisteredMockDashboardSnapshot } from "./infrastructure/mock/mock-dashboard-snapshot";

type SnapshotUpdater = (snapshot: DashboardSnapshot) => DashboardSnapshot;
type SnapshotFeedbackTone = "success" | "error" | "info";

export type SnapshotFeedback = {
  tone: SnapshotFeedbackTone;
  text: string;
};

export type WorkspaceSnapshotSummary = {
  workspaceId: string;
  snapshotId: string;
  name: string;
  systemSlug: string;
  status: DashboardSnapshotStatus;
  createdAt: string;
  updatedAt: string;
};

function createWorkspaceRecordId(): string {
  return `ws-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugifySnapshotName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "snapshot";
}

function createWorkspaceFromSnapshot(
  snapshot: DashboardSnapshot,
): DashboardWorkspaceStorage {
  const now = new Date().toISOString();
  const record: DashboardWorkspaceSnapshotRecord = {
    id: createWorkspaceRecordId(),
    createdAt: snapshot.meta.createdAt || now,
    updatedAt: snapshot.meta.updatedAt || now,
    snapshot,
  };

  return {
    currentSnapshotId: record.id,
    snapshots: [record],
  };
}

function ensureCurrentSnapshotRecord(
  workspace: DashboardWorkspaceStorage,
): DashboardWorkspaceSnapshotRecord {
  return (
    workspace.snapshots.find((item) => item.id === workspace.currentSnapshotId) ??
    workspace.snapshots[0]
  );
}

function createWorkspaceSnapshotSummary(
  record: DashboardWorkspaceSnapshotRecord,
): WorkspaceSnapshotSummary {
  return {
    workspaceId: record.id,
    snapshotId: record.snapshot.meta.id,
    name: record.snapshot.meta.name,
    systemSlug: record.snapshot.meta.systemSlug,
    status: record.snapshot.meta.status,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function renameSnapshotDocument(
  snapshot: DashboardSnapshot,
  nextName: string,
): DashboardSnapshot {
  return {
    ...snapshot,
    meta: {
      ...snapshot.meta,
      name: nextName,
    },
    diagrams: snapshot.diagrams.map((diagram, index) =>
      index === 0 ? { ...diagram, name: nextName } : diagram,
    ),
  };
}

function createNewWorkspaceSnapshot(
  registeredSnapshot: DashboardSnapshot,
  count: number,
): DashboardSnapshot {
  const now = new Date().toISOString();
  const label = `Untitled Snapshot ${count}`;
  const diagramName = `Architecture: ${label}`;
  const slug = slugifySnapshotName(label);

  return touchDashboardSnapshot(
    {
      ...registeredSnapshot,
      meta: {
        ...registeredSnapshot.meta,
        id: slug,
        name: diagramName,
        description: "Local workspace snapshot created from the registered base.",
        systemSlug: slug,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      },
      diagrams: [
        {
          id: slug,
          name: diagramName,
          desc: "Primary architecture snapshot",
          dot: true,
        },
      ],
      analysis: {
        ...registeredSnapshot.analysis,
        source: "mock",
        lastAnalyzedAt: null,
      },
    },
    {
      status: "draft",
      analysis: {
        source: "mock",
        lastAnalyzedAt: null,
      },
    },
  );
}

function createDuplicatedSnapshot(snapshot: DashboardSnapshot): DashboardSnapshot {
  const now = new Date().toISOString();
  const nextName = `${snapshot.meta.name} Copy`;
  const slug = slugifySnapshotName(
    `${snapshot.meta.systemSlug || snapshot.meta.id}-copy-${Date.now()}`,
  );

  return touchDashboardSnapshot(
    {
      ...snapshot,
      meta: {
        ...snapshot.meta,
        id: slug,
        name: nextName,
        systemSlug: slug,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      },
      diagrams: snapshot.diagrams.map((diagram, index) =>
        index === 0
          ? {
              ...diagram,
              id: slug,
              name: nextName,
            }
          : diagram,
      ),
    },
    { status: "draft" },
  );
}

export function useDashboardSnapshot() {
  const registeredSnapshot = useMemo(
    () => getRegisteredMockDashboardSnapshot(),
    [],
  );
  const exampleCatalog = useMemo<DashboardExampleCatalogItem[]>(
    () => getDashboardExampleCatalog(),
    [],
  );
  const [workspace, setWorkspace] = useState<DashboardWorkspaceStorage>(
    () =>
      loadDashboardWorkspaceFromStorage() ??
      createWorkspaceFromSnapshot(registeredSnapshot),
  );
  const currentSnapshotRecord = useMemo(
    () => ensureCurrentSnapshotRecord(workspace),
    [workspace],
  );
  const snapshot = currentSnapshotRecord.snapshot;
  const workspaceSnapshots = useMemo<WorkspaceSnapshotSummary[]>(
    () =>
      workspace.snapshots
        .map(createWorkspaceSnapshotSummary)
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
    [workspace],
  );
  const [jsonDraft, setJsonDraft] = useState(() =>
    stringifyDashboardSnapshot(currentSnapshotRecord.snapshot),
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonFeedback, setJsonFeedback] = useState<SnapshotFeedback | null>(null);

  useEffect(() => {
    saveDashboardWorkspaceToStorage(workspace);
  }, [workspace]);

  const syncJsonDraftToSnapshot = (
    nextSnapshot: DashboardSnapshot,
    feedback?: SnapshotFeedback | null,
  ) => {
    setJsonDraft(stringifyDashboardSnapshot(nextSnapshot));
    setJsonError(null);
    if (feedback !== undefined) {
      setJsonFeedback(feedback);
    }
  };

  const commitCurrentSnapshot = (
    updater: SnapshotUpdater,
    options: {
      status?: DashboardSnapshotStatus;
      analysis?: Partial<DashboardSnapshotAnalysis>;
    } = {},
  ) => {
    setWorkspace((currentWorkspace) => {
      const currentRecord = ensureCurrentSnapshotRecord(currentWorkspace);

      return {
        ...currentWorkspace,
        currentSnapshotId: currentRecord.id,
        snapshots: currentWorkspace.snapshots.map((record) => {
          if (record.id !== currentRecord.id) {
            return record;
          }

          const nextSnapshot = touchDashboardSnapshot(
            updater(record.snapshot),
            options,
          );

          return {
            ...record,
            updatedAt: nextSnapshot.meta.updatedAt,
            snapshot: nextSnapshot,
          };
        }),
      };
    });
  };

  const updateSnapshot = (updater: SnapshotUpdater) => {
    commitCurrentSnapshot(updater, { status: "draft" });
    setJsonFeedback(null);
  };

  const applyAnalysisResult = (analysis: DashboardSnapshotAnalysis) => {
    commitCurrentSnapshot(
      (currentSnapshot) => ({
        ...currentSnapshot,
        analysis,
      }),
      { status: "analyzed", analysis },
    );
  };

  const switchWorkspaceSnapshot = (workspaceId: string) => {
    const nextRecord = workspace.snapshots.find((item) => item.id === workspaceId);
    if (!nextRecord) {
      const message = "Could not switch to the selected snapshot.";

      setJsonError(message);
      setJsonFeedback({ tone: "error", text: message });
      return false;
    }

    setWorkspace((currentWorkspace) => ({
      ...currentWorkspace,
      currentSnapshotId: workspaceId,
    }));
    syncJsonDraftToSnapshot(nextRecord.snapshot, {
      tone: "info",
      text: `Switched to snapshot ${nextRecord.snapshot.meta.name}.`,
    });
    return true;
  };

  const insertWorkspaceSnapshot = (
    nextSnapshot: DashboardSnapshot,
    feedback: SnapshotFeedback,
  ) => {
    const recordId = createWorkspaceRecordId();
    const nextRecord: DashboardWorkspaceSnapshotRecord = {
      id: recordId,
      createdAt: nextSnapshot.meta.createdAt,
      updatedAt: nextSnapshot.meta.updatedAt,
      snapshot: nextSnapshot,
    };

    setWorkspace((currentWorkspace) => ({
      currentSnapshotId: recordId,
      snapshots: [nextRecord, ...currentWorkspace.snapshots],
    }));
    syncJsonDraftToSnapshot(nextSnapshot, feedback);
    return true;
  };

  const replaceCurrentWorkspaceSnapshot = (
    nextSnapshot: DashboardSnapshot,
    feedback: SnapshotFeedback,
  ) => {
    const currentRecordId = currentSnapshotRecord.id;

    setWorkspace((currentWorkspace) => ({
      ...currentWorkspace,
      currentSnapshotId: currentRecordId,
      snapshots: currentWorkspace.snapshots.map((record) =>
        record.id === currentRecordId
          ? {
              ...record,
              updatedAt: nextSnapshot.meta.updatedAt,
              snapshot: nextSnapshot,
            }
          : record,
      ),
    }));
    syncJsonDraftToSnapshot(nextSnapshot, feedback);
    return true;
  };

  const loadCurrentSnapshotIntoDraft = () => {
    syncJsonDraftToSnapshot(snapshot, {
      tone: "info",
      text: "Draft reloaded from the current canvas snapshot.",
    });
  };

  const applyJsonText = (
    jsonText: string,
    feedback: SnapshotFeedback,
    mode: "replace-current" | "create-new" = "replace-current",
  ) => {
    try {
      const nextSnapshot = parseDashboardSnapshotText(jsonText);
      const touchedSnapshot = touchDashboardSnapshot(nextSnapshot);

      if (mode === "create-new") {
        return insertWorkspaceSnapshot(touchedSnapshot, feedback);
      }

      return replaceCurrentWorkspaceSnapshot(touchedSnapshot, feedback);
    } catch (error) {
      const message = formatDashboardSnapshotError(error);

      setJsonDraft(jsonText);
      setJsonError(message);
      setJsonFeedback({ tone: "error", text: message });
      return false;
    }
  };

  const applyJsonDraft = () =>
    applyJsonText(jsonDraft, {
      tone: "success",
      text: "Snapshot JSON applied to the current workspace snapshot.",
    });

  const importJsonFile = async (file: File) => {
    try {
      const jsonText = await readTextFile(file);

      return applyJsonText(
        jsonText,
        {
          tone: "success",
          text: `Imported snapshot file ${file.name} as a new workspace snapshot.`,
        },
        "create-new",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not read the JSON file.";

      setJsonError(message);
      setJsonFeedback({ tone: "error", text: message });
      return false;
    }
  };

  const exportJsonFile = () => {
    const payload = stringifyDashboardSnapshot(snapshot);
    const filename = `${snapshot.meta.systemSlug || snapshot.meta.id}.snapshot.json`;

    downloadTextFile({ filename, text: payload });
    setJsonDraft(payload);
    setJsonError(null);
    setJsonFeedback({
      tone: "success",
      text: `Exported snapshot file ${filename}.`,
    });
  };

  const loadExampleSnapshot = (exampleId: string) => {
    const exampleSnapshot = getDashboardExampleSnapshot(exampleId);
    if (!exampleSnapshot) {
      const message = "Could not load the selected example snapshot.";

      setJsonError(message);
      setJsonFeedback({ tone: "error", text: message });
      return false;
    }

    return insertWorkspaceSnapshot(exampleSnapshot, {
      tone: "success",
      text: `Loaded example snapshot ${exampleSnapshot.meta.name}.`,
    });
  };

  const createSnapshot = () => {
    const nextSnapshot = createNewWorkspaceSnapshot(
      registeredSnapshot,
      workspace.snapshots.length + 1,
    );

    return insertWorkspaceSnapshot(nextSnapshot, {
      tone: "success",
      text: `Created workspace snapshot ${nextSnapshot.meta.name}.`,
    });
  };

  const duplicateSnapshot = (workspaceId = currentSnapshotRecord.id) => {
    const sourceRecord = workspace.snapshots.find((item) => item.id === workspaceId);
    if (!sourceRecord) {
      const message = "Could not duplicate the selected snapshot.";

      setJsonError(message);
      setJsonFeedback({ tone: "error", text: message });
      return false;
    }

    const duplicatedSnapshot = createDuplicatedSnapshot(sourceRecord.snapshot);

    return insertWorkspaceSnapshot(duplicatedSnapshot, {
      tone: "success",
      text: `Duplicated snapshot ${sourceRecord.snapshot.meta.name}.`,
    });
  };

  const renameWorkspaceSnapshot = (workspaceId: string, nextName: string) => {
    const trimmedName = nextName.trim();
    if (!trimmedName) {
      const message = "Snapshot name cannot be empty.";

      setJsonError(message);
      setJsonFeedback({ tone: "error", text: message });
      return false;
    }

    const sourceRecord = workspace.snapshots.find((item) => item.id === workspaceId);
    if (!sourceRecord) {
      const message = "Could not rename the selected snapshot.";

      setJsonError(message);
      setJsonFeedback({ tone: "error", text: message });
      return false;
    }

    const renamedSnapshot = touchDashboardSnapshot(
      renameSnapshotDocument(sourceRecord.snapshot, trimmedName),
      { status: "draft" },
    );

    setWorkspace((currentWorkspace) => ({
      ...currentWorkspace,
      snapshots: currentWorkspace.snapshots.map((record) =>
        record.id === workspaceId
          ? {
              ...record,
              updatedAt: renamedSnapshot.meta.updatedAt,
              snapshot: renamedSnapshot,
            }
          : record,
      ),
    }));

    if (workspaceId === currentSnapshotRecord.id) {
      syncJsonDraftToSnapshot(renamedSnapshot, {
        tone: "success",
        text: `Renamed snapshot to ${trimmedName}.`,
      });
    } else {
      setJsonFeedback({
        tone: "success",
        text: `Renamed snapshot to ${trimmedName}.`,
      });
    }

    return true;
  };

  const deleteWorkspaceSnapshot = (workspaceId: string) => {
    if (workspace.snapshots.length === 1) {
      const message = "At least one local snapshot must remain in the workspace.";

      setJsonError(message);
      setJsonFeedback({ tone: "error", text: message });
      return false;
    }

    const nextSnapshots = workspace.snapshots.filter((item) => item.id !== workspaceId);
    if (nextSnapshots.length === workspace.snapshots.length) {
      const message = "Could not delete the selected snapshot.";

      setJsonError(message);
      setJsonFeedback({ tone: "error", text: message });
      return false;
    }

    const nextCurrentRecord =
      workspace.currentSnapshotId === workspaceId
        ? nextSnapshots[0]
        : ensureCurrentSnapshotRecord({
            currentSnapshotId: workspace.currentSnapshotId,
            snapshots: nextSnapshots,
          });

    setWorkspace({
      currentSnapshotId: nextCurrentRecord.id,
      snapshots: nextSnapshots,
    });
    syncJsonDraftToSnapshot(nextCurrentRecord.snapshot, {
      tone: "info",
      text: `Deleted workspace snapshot and switched to ${nextCurrentRecord.snapshot.meta.name}.`,
    });
    return true;
  };

  const resetToRegisteredSnapshot = () => {
    const nextSnapshot = touchDashboardSnapshot(registeredSnapshot, {
      status: "draft",
      analysis: {
        source: "mock",
        lastAnalyzedAt: null,
      },
    });

    return replaceCurrentWorkspaceSnapshot(nextSnapshot, {
      tone: "info",
      text: "Current workspace snapshot reset to the registered base snapshot.",
    });
  };

  const resetWorkspaceStorage = () => {
    clearDashboardWorkspaceFromStorage();
    const nextWorkspace = createWorkspaceFromSnapshot(registeredSnapshot);
    const nextRecord = ensureCurrentSnapshotRecord(nextWorkspace);

    setWorkspace(nextWorkspace);
    syncJsonDraftToSnapshot(nextRecord.snapshot, {
      tone: "info",
      text: "Local workspace storage cleared and recreated from the registered base snapshot.",
    });
  };

  const clearJsonFeedback = () => {
    setJsonFeedback(null);
  };

  return {
    snapshot,
    activeWorkspaceSnapshotId: currentSnapshotRecord.id,
    workspaceSnapshots,
    exampleCatalog,
    jsonDraft,
    jsonError,
    jsonFeedback,
    setJsonDraft,
    updateSnapshot,
    applyAnalysisResult,
    applyJsonDraft,
    importJsonFile,
    exportJsonFile,
    loadExampleSnapshot,
    switchWorkspaceSnapshot,
    createSnapshot,
    duplicateSnapshot,
    renameWorkspaceSnapshot,
    deleteWorkspaceSnapshot,
    loadCurrentSnapshotIntoDraft,
    resetToRegisteredSnapshot,
    resetWorkspaceStorage,
    clearJsonFeedback,
  };
}
