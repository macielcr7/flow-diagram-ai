import type { ArchNode, Conn } from "../dashboard-types";
import type { SnapshotFeedback } from "../use-dashboard-snapshot";
import type { DashboardExampleCatalogItem } from "../infrastructure/examples/dashboard-example-catalog";
import { ExampleCatalogPanel } from "./ExampleCatalogPanel";
import { SnapshotManagerPanel } from "./SnapshotManagerPanel";
import { AddNodeDialog } from "./panels/AddNodeDialog";
import { ConnEditPanel } from "./panels/ConnEditPanel";
import { NodeEditPanel } from "./panels/NodeEditPanel";
import { SnapshotEditorPanel } from "./SnapshotEditorPanel";
import type { WorkspaceSnapshotSummary } from "../use-dashboard-snapshot";

type FloatingPanelsProps = {
  editMode: boolean;
  editingNode: ArchNode | undefined;
  selectedConn: Conn | undefined;
  showAdd: boolean;
  addPos: { x: number; y: number };
  onUpdateNode: (nodeId: string, patch: Partial<ArchNode>) => void;
  onDeleteNode: (nodeId: string) => void;
  onCloseNode: () => void;
  onUpdateConn: (connId: string, patch: Partial<Conn>) => void;
  onDeleteConn: (connId: string) => void;
  onCloseConn: () => void;
  onAddNode: (node: Omit<ArchNode, "id">) => void;
  onCloseAdd: () => void;
  showSnapshotManager: boolean;
  workspaceSnapshots: WorkspaceSnapshotSummary[];
  activeWorkspaceSnapshotId: string;
  onCreateSnapshot: () => void;
  onSwitchSnapshot: (workspaceId: string) => void;
  onRenameSnapshot: (workspaceId: string, nextName: string) => void;
  onDuplicateSnapshot: (workspaceId: string) => void;
  onDeleteSnapshot: (workspaceId: string) => void;
  onCloseSnapshotManager: () => void;
  showExampleCatalog: boolean;
  exampleItems: DashboardExampleCatalogItem[];
  activeSnapshotId: string;
  onLoadExample: (exampleId: string) => void;
  onCloseExampleCatalog: () => void;
  showSnapshotJson: boolean;
  snapshotId: string;
  snapshotUpdatedAt: string;
  jsonDraft: string;
  jsonError: string | null;
  jsonFeedback: SnapshotFeedback | null;
  onChangeJsonDraft: (value: string) => void;
  onImportJsonFile: (file: File) => void | Promise<void>;
  onLoadCurrentJson: () => void;
  onApplyJsonDraft: () => void;
  onExportJsonDraft: () => void;
  onResetSnapshot: () => void;
  onCloseSnapshotJson: () => void;
};

export function FloatingPanels({
  editMode,
  editingNode,
  selectedConn,
  showAdd,
  addPos,
  onUpdateNode,
  onDeleteNode,
  onCloseNode,
  onUpdateConn,
  onDeleteConn,
  onCloseConn,
  onAddNode,
  onCloseAdd,
  showSnapshotManager,
  workspaceSnapshots,
  activeWorkspaceSnapshotId,
  onCreateSnapshot,
  onSwitchSnapshot,
  onRenameSnapshot,
  onDuplicateSnapshot,
  onDeleteSnapshot,
  onCloseSnapshotManager,
  showExampleCatalog,
  exampleItems,
  activeSnapshotId,
  onLoadExample,
  onCloseExampleCatalog,
  showSnapshotJson,
  snapshotId,
  snapshotUpdatedAt,
  jsonDraft,
  jsonError,
  jsonFeedback,
  onChangeJsonDraft,
  onImportJsonFile,
  onLoadCurrentJson,
  onApplyJsonDraft,
  onExportJsonDraft,
  onResetSnapshot,
  onCloseSnapshotJson,
}: FloatingPanelsProps) {
  return (
    <>
      {showSnapshotManager && (
        <SnapshotManagerPanel
          items={workspaceSnapshots}
          activeWorkspaceSnapshotId={activeWorkspaceSnapshotId}
          onCreateSnapshot={onCreateSnapshot}
          onSwitchSnapshot={onSwitchSnapshot}
          onRenameSnapshot={onRenameSnapshot}
          onDuplicateSnapshot={onDuplicateSnapshot}
          onDeleteSnapshot={onDeleteSnapshot}
          onClose={onCloseSnapshotManager}
        />
      )}
      {showExampleCatalog && (
        <ExampleCatalogPanel
          items={exampleItems}
          activeSnapshotId={activeSnapshotId}
          onLoadExample={onLoadExample}
          onClose={onCloseExampleCatalog}
        />
      )}
      {showSnapshotJson && (
        <SnapshotEditorPanel
          jsonDraft={jsonDraft}
          jsonError={jsonError}
          jsonFeedback={jsonFeedback}
          snapshotId={snapshotId}
          updatedAt={snapshotUpdatedAt}
          onChangeDraft={onChangeJsonDraft}
          onImportFile={onImportJsonFile}
          onLoadCurrent={onLoadCurrentJson}
          onApply={onApplyJsonDraft}
          onExport={onExportJsonDraft}
          onReset={onResetSnapshot}
          onClose={onCloseSnapshotJson}
        />
      )}
      {editingNode && editMode && (
        <NodeEditPanel
          key={editingNode.id}
          node={editingNode}
          onUpdate={(patch) => onUpdateNode(editingNode.id, patch)}
          onDelete={() => onDeleteNode(editingNode.id)}
          onClose={onCloseNode}
        />
      )}
      {selectedConn && editMode && (
        <ConnEditPanel
          key={selectedConn.id}
          conn={selectedConn}
          onUpdate={(patch) => onUpdateConn(selectedConn.id, patch)}
          onDelete={() => onDeleteConn(selectedConn.id)}
          onClose={onCloseConn}
        />
      )}
      {showAdd && (
        <AddNodeDialog pos={addPos} onAdd={onAddNode} onClose={onCloseAdd} />
      )}
    </>
  );
}
