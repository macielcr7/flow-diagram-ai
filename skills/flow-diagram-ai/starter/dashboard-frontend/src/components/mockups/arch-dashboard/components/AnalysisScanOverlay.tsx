type AnalysisScanOverlayProps = {
  visible: boolean;
};

export function AnalysisScanOverlay({ visible }: AnalysisScanOverlayProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg,transparent,#3b82f6,#7c3aed,transparent)",
          animation: "scanLine 2s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 30%,#1d4ed820,transparent 60%)",
        }}
      />
    </div>
  );
}
