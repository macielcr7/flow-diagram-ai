export function TopBarBrand() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#7c3aed)",
          borderRadius: "6px",
          padding: "4px 9px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
        >
          <rect x="3" y="3" width="6" height="6" rx="1" />
          <rect x="15" y="3" width="6" height="6" rx="1" />
          <rect x="9" y="15" width="6" height="6" rx="1" />
          <line x1="6" y1="9" x2="6" y2="12" />
          <line x1="6" y1="12" x2="12" y2="12" />
          <line x1="18" y1="9" x2="18" y2="12" />
          <line x1="18" y1="12" x2="12" y2="12" />
          <line x1="12" y1="12" x2="12" y2="15" />
        </svg>
        <span
          style={{
            color: "#fff",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.5px",
          }}
        >
          FlowChartAI
        </span>
      </div>
      <span style={{ color: "#374151", fontSize: "10px" }}>by Maciel</span>
    </div>
  );
}
