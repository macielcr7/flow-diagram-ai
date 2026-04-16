export function TopBarSnapshotSummary({
  activeDiagramName,
}: {
  activeDiagramName: string;
}) {
  return (
    <>
      <div style={{ width: 1, height: 22, background: "#1a2d4a" }} />
      <span style={{ color: "#64748b", fontSize: "11px" }}>Active diagram:</span>
      <span style={{ color: "#cbd5e1", fontSize: "11px", fontWeight: 500 }}>
        {activeDiagramName}
      </span>
    </>
  );
}
