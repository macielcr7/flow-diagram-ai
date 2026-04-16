import { useState } from "react";

import { CSS } from "./dashboard-constants";
import { useAnalysis } from "./use-analysis";
import { useDashboardSnapshot } from "./use-dashboard-snapshot";
import { useDashboardView } from "./use-dashboard-view";
import { useDiagramEditor } from "./use-diagram-editor";
import { DiagramCanvas } from "./components/DiagramCanvas";
import { FloatingPanels } from "./components/FloatingPanels";
import { LeftSidebar } from "./components/LeftSidebar";
import { RightSidebar } from "./components/RightSidebar";
import { StatusBar } from "./components/StatusBar";
import { TopBar } from "./components/TopBar";

export function Dashboard() {
  const [showSnapshotManager, setShowSnapshotManager] = useState(false);
  const [showExampleCatalog, setShowExampleCatalog] = useState(false);
  const [showSnapshotJson, setShowSnapshotJson] = useState(false);
  const snapshotState = useDashboardSnapshot();
  const { snapshot } = snapshotState;
  const { state: analysisState, progress, stats, run: runAnalysis } =
    useAnalysis(snapshot, snapshotState.applyAnalysisResult);
  const view = useDashboardView();
  const diagram = useDiagramEditor(snapshot, snapshotState.updateSnapshot);

  const handleImportSnapshotJson = async (file: File) => {
    const imported = await snapshotState.importJsonFile(file);
    if (!imported) {
      setShowSnapshotManager(false);
      setShowExampleCatalog(false);
      setShowSnapshotJson(true);
      return;
    }

    setShowSnapshotManager(false);
    setShowExampleCatalog(false);
  };

  const handleLoadExample = (exampleId: string) => {
    const loaded = snapshotState.loadExampleSnapshot(exampleId);
    if (!loaded) {
      setShowSnapshotManager(false);
      setShowSnapshotJson(true);
      return;
    }

    setShowSnapshotManager(false);
    setShowExampleCatalog(false);
    setShowSnapshotJson(false);
  };

  const handleOpenSnapshotManager = () => {
    setShowExampleCatalog(false);
    setShowSnapshotJson(false);
    setShowSnapshotManager(true);
  };

  const handleOpenExampleCatalog = () => {
    setShowSnapshotManager(false);
    setShowSnapshotJson(false);
    setShowExampleCatalog(true);
  };

  const handleOpenSnapshotJson = () => {
    setShowSnapshotManager(false);
    setShowExampleCatalog(false);
    setShowSnapshotJson(true);
  };

  return (
    <div
      style={{
        background: "#07101f",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        color: "#e2e8f0",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{CSS}</style>

      <TopBar
        analysisState={analysisState}
        progress={progress}
        stats={stats}
        activeDiagramName={snapshot.meta.name}
        snapshotStatus={snapshot.meta.status}
        snapshotUpdatedAt={snapshot.meta.updatedAt}
        onAnalyze={runAnalysis}
        onOpenSnapshotManager={handleOpenSnapshotManager}
        onOpenExampleCatalog={handleOpenExampleCatalog}
        onOpenSnapshotJson={handleOpenSnapshotJson}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        <LeftSidebar />

        <DiagramCanvas
          nodes={diagram.nodes}
          conns={diagram.conns}
          selectedNodeId={diagram.selectedNodeId}
          selectedConnId={diagram.selectedConnId}
          editMode={diagram.editMode}
          animOn={diagram.animOn}
          analysisScanning={analysisState === "scanning"}
          zoom={diagram.zoom}
          pan={diagram.pan}
          sourceNode={diagram.sourceNode}
          hoveredConnectTargetId={diagram.hoveredConnectTargetId}
          connPreview={diagram.connPreview}
          routePreview={diagram.routePreview}
          svgRef={diagram.svgRef}
          isPanning={diagram.isPanning}
          isConnecting={diagram.isConnecting}
          routeDragAxis={diagram.routeDragAxis}
          onCanvasMouseMove={diagram.onCanvasMouseMove}
          onCanvasMouseUp={diagram.onCanvasMouseUp}
          onSvgMouseDown={diagram.onSvgMouseDown}
          onSvgClick={diagram.onSvgClick}
          onDrop={diagram.onDrop}
          onSelectConn={diagram.selectConn}
          onDeleteConn={diagram.deleteConn}
          onConnRouteDragStart={diagram.onConnRouteDragStart}
          onNodeMouseDown={diagram.onNodeMouseDown}
          onNodeMouseUp={diagram.onNodeMouseUp}
          onNodeMouseEnter={diagram.onNodeMouseEnter}
          onNodeMouseLeave={diagram.onNodeMouseLeave}
          onNodeSelect={diagram.onNodeSelect}
          onNodeStartConn={diagram.onNodeStartConn}
          onNodeDoubleClick={diagram.openNodeEditor}
          onZoomIn={diagram.zoomIn}
          onZoomOut={diagram.zoomOut}
          onResetViewport={diagram.resetViewport}
        />

        <RightSidebar
          selectedNode={diagram.selectedNode}
          selectedConn={diagram.selectedConn}
          nodes={diagram.nodes}
          conns={diagram.conns}
          endpointsByNode={snapshot.endpointsByNode}
          methodFilter={view.methodFilter}
          onChangeMethodFilter={view.setMethodFilter}
          editMode={diagram.editMode}
          onChangeEditMode={diagram.setEditMode}
          animOn={diagram.animOn}
          onChangeAnimOn={diagram.setAnimOn}
          onOpenAddNode={() => diagram.openAddDialog()}
          onOpenSnapshotJson={handleOpenSnapshotJson}
          onResetViewport={diagram.resetViewport}
          onClearSelection={diagram.clearSelection}
          onOpenNodeEditor={diagram.openNodeEditor}
          onDuplicateNode={diagram.duplicateNode}
          onCenterNode={diagram.centerNode}
          onDeleteNode={diagram.deleteNode}
          onDeleteConn={diagram.deleteConn}
        />

        <FloatingPanels
          editMode={diagram.editMode}
          editingNode={diagram.editingNode}
          selectedConn={diagram.selectedConn}
          showAdd={diagram.showAdd}
          addPos={diagram.addPos}
          onUpdateNode={diagram.updateNode}
          onDeleteNode={diagram.deleteNode}
          onCloseNode={diagram.closeNodeEditor}
          onUpdateConn={diagram.updateConn}
          onDeleteConn={diagram.deleteConn}
          onCloseConn={() => diagram.selectConn(null)}
          onAddNode={diagram.addNode}
          onCloseAdd={diagram.closeAddDialog}
          showSnapshotManager={showSnapshotManager}
          workspaceSnapshots={snapshotState.workspaceSnapshots}
          activeWorkspaceSnapshotId={snapshotState.activeWorkspaceSnapshotId}
          onCreateSnapshot={snapshotState.createSnapshot}
          onSwitchSnapshot={(workspaceId) => {
            const switched = snapshotState.switchWorkspaceSnapshot(workspaceId);
            if (switched) {
              setShowSnapshotManager(false);
            }
          }}
          onRenameSnapshot={snapshotState.renameWorkspaceSnapshot}
          onDuplicateSnapshot={snapshotState.duplicateSnapshot}
          onDeleteSnapshot={snapshotState.deleteWorkspaceSnapshot}
          onCloseSnapshotManager={() => setShowSnapshotManager(false)}
          showExampleCatalog={showExampleCatalog}
          exampleItems={snapshotState.exampleCatalog}
          activeSnapshotId={snapshot.meta.id}
          onLoadExample={handleLoadExample}
          onCloseExampleCatalog={() => setShowExampleCatalog(false)}
          showSnapshotJson={showSnapshotJson}
          snapshotId={snapshot.meta.id}
          snapshotUpdatedAt={snapshot.meta.updatedAt}
          jsonDraft={snapshotState.jsonDraft}
          jsonError={snapshotState.jsonError}
          jsonFeedback={snapshotState.jsonFeedback}
          onChangeJsonDraft={snapshotState.setJsonDraft}
          onImportJsonFile={handleImportSnapshotJson}
          onLoadCurrentJson={snapshotState.loadCurrentSnapshotIntoDraft}
          onApplyJsonDraft={snapshotState.applyJsonDraft}
          onExportJsonDraft={snapshotState.exportJsonFile}
          onResetSnapshot={snapshotState.resetToRegisteredSnapshot}
          onCloseSnapshotJson={() => setShowSnapshotJson(false)}
        />
      </div>

      <StatusBar
        stats={stats}
        snapshotId={snapshot.meta.id}
        lastAnalyzedAt={snapshot.analysis.lastAnalyzedAt}
      />
    </div>
  );
}
