type ZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "104px",
        left: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {[
        { icon: "+", onClick: onZoomIn },
        { icon: "−", onClick: onZoomOut },
      ].map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          style={{
            width: 26,
            height: 26,
            background: "#0b1628",
            border: "1px solid #1a2d4a",
            borderRadius: index === 0 ? "4px 4px 0 0" : "0 0 4px 4px",
            color: "#94a3b8",
            fontSize: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            borderTopWidth: index === 1 ? 0 : undefined,
          }}
        >
          {button.icon}
        </button>
      ))}
      <button
        onClick={onReset}
        style={{
          width: 26,
          height: 26,
          background: "#0b1628",
          border: "1px solid #1a2d4a",
          borderRadius: "4px",
          color: "#94a3b8",
          fontSize: "11px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "4px",
        }}
      >
        ⤢
      </button>
    </div>
  );
}
