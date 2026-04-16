import type { ArchNode, Conn, EndpointMap, HttpMethod } from "../dashboard-types";
import { NodeDetail } from "./NodeDetail";
import { ActionsSection } from "./right-sidebar/ActionsSection";
import { EndpointsSection } from "./right-sidebar/EndpointsSection";
import { SettingsSection } from "./right-sidebar/SettingsSection";
import { SelectedConnectionSection } from "./right-sidebar/SelectedConnectionSection";
import { SelectedNodeActionsSection } from "./right-sidebar/SelectedNodeActionsSection";

type RightSidebarProps = {
  selectedNode: ArchNode | undefined;
  selectedConn: Conn | undefined;
  nodes: ArchNode[];
  conns: Conn[];
  endpointsByNode: EndpointMap;
  methodFilter: HttpMethod | "ALL";
  onChangeMethodFilter: (method: HttpMethod | "ALL") => void;
  editMode: boolean;
  onChangeEditMode: (value: boolean) => void;
  animOn: boolean;
  onChangeAnimOn: (value: boolean) => void;
  onOpenAddNode: () => void;
  onOpenSnapshotJson: () => void;
  onResetViewport: () => void;
  onClearSelection: () => void;
  onOpenNodeEditor: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onCenterNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteConn: (connId: string) => void;
};

export function RightSidebar({
  selectedNode,
  selectedConn,
  nodes,
  conns,
  endpointsByNode,
  methodFilter,
  onChangeMethodFilter,
  editMode,
  onChangeEditMode,
  animOn,
  onChangeAnimOn,
  onOpenAddNode,
  onOpenSnapshotJson,
  onResetViewport,
  onClearSelection,
  onOpenNodeEditor,
  onDuplicateNode,
  onCenterNode,
  onDeleteNode,
  onDeleteConn,
}: RightSidebarProps) {
  return (
    <div
      style={{
        width: "196px",
        flexShrink: 0,
        background: "#0b1628",
        borderLeft: "1px solid #1a2d4a",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "10px 12px 8px",
          borderBottom: "1px solid #1a2d4a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            color: "#64748b",
            fontSize: "9.5px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Inspector
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      </div>

      {selectedNode ? (
        <NodeDetail
          node={selectedNode}
          nodes={nodes}
          conns={conns}
          endpointsByNode={endpointsByNode}
        />
      ) : selectedConn ? (
        <SelectedConnectionSection
          conn={selectedConn}
          nodes={nodes}
          onDelete={() => onDeleteConn(selectedConn.id)}
        />
      ) : (
        <EndpointsSection
          nodes={nodes}
          endpointsByNode={endpointsByNode}
          methodFilter={methodFilter}
          onChangeMethodFilter={onChangeMethodFilter}
        />
      )}

      {selectedNode && (
        <SelectedNodeActionsSection
          node={selectedNode}
          onEdit={() => onOpenNodeEditor(selectedNode.id)}
          onDuplicate={() => onDuplicateNode(selectedNode.id)}
          onCenter={() => onCenterNode(selectedNode.id)}
          onDelete={() => onDeleteNode(selectedNode.id)}
        />
      )}

      <SettingsSection
        editMode={editMode}
        onChangeEditMode={onChangeEditMode}
        animOn={animOn}
        onChangeAnimOn={onChangeAnimOn}
      />
      <ActionsSection
        onOpenAddNode={onOpenAddNode}
        onOpenSnapshotJson={onOpenSnapshotJson}
        onResetViewport={onResetViewport}
        onClearSelection={onClearSelection}
      />
    </div>
  );
}
