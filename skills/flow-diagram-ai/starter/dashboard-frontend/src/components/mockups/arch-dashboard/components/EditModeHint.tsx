type EditModeHintProps = {
  visible: boolean;
};

export function EditModeHint({ visible }: EditModeHintProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#0a1221",
        border: "1px solid #1e3a5f",
        borderRadius: "20px",
        padding: "4px 14px",
        fontSize: "10px",
        color: "#475569",
        zIndex: 6,
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      Drag to move · Drag from → to connect · Double-click card to edit · Click link to edit
    </div>
  );
}
