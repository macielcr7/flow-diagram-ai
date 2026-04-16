import type { DashboardExampleCatalogItem } from "../infrastructure/examples/dashboard-example-catalog";

type ExampleCatalogPanelProps = {
  items: DashboardExampleCatalogItem[];
  activeSnapshotId: string;
  onLoadExample: (exampleId: string) => void;
  onClose: () => void;
};

export function ExampleCatalogPanel({
  items,
  activeSnapshotId,
  onLoadExample,
  onClose,
}: ExampleCatalogPanelProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "16px",
        right: "214px",
        width: "440px",
        background: "#0d1828",
        border: "1px solid #1d4ed8",
        borderRadius: "12px",
        padding: "14px",
        zIndex: 240,
        boxShadow: "0 12px 42px #00000099",
        animation: "fadeIn .15s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        <div>
          <div style={{ color: "#93c5fd", fontSize: "12px", fontWeight: 700 }}>
            Example Snapshots
          </div>
          <div style={{ color: "#475569", fontSize: "10px", marginTop: "3px" }}>
            Load an example into the current workspace.
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#475569",
            cursor: "pointer",
            fontSize: "16px",
            lineHeight: 1,
          }}
          type="button"
        >
          ×
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          maxHeight: "520px",
          overflowY: "auto",
          paddingRight: "2px",
        }}
      >
        {items.map((item) => {
          const isActive = item.id === activeSnapshotId;

          return (
            <div
              key={item.id}
              style={{
                border: `1px solid ${isActive ? "#2563eb" : "#1a2d4a"}`,
                borderRadius: "10px",
                background: isActive ? "#0f1f38" : "#0a1221",
                padding: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#e2e8f0", fontSize: "11px", fontWeight: 600 }}>
                    {item.name}
                  </div>
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "9.5px",
                      marginTop: "4px",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.description}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginTop: "8px",
                      color: "#94a3b8",
                      fontSize: "9.5px",
                    }}
                  >
                    <span>{item.stats.services} nodes</span>
                    <span>{item.stats.flows} flows</span>
                    <span>{item.stats.endpoints} endpoints</span>
                  </div>
                  <div style={{ color: "#475569", fontSize: "9px", marginTop: "6px" }}>
                    {item.filename}
                  </div>
                </div>

                <button
                  onClick={() => onLoadExample(item.id)}
                  style={{
                    background: isActive ? "#1d4ed8" : "#0f172a",
                    border: `1px solid ${isActive ? "#2563eb" : "#1e3a5f"}`,
                    borderRadius: "6px",
                    color: isActive ? "#dbeafe" : "#cbd5e1",
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "7px 10px",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  type="button"
                >
                  {isActive ? "Reload" : "Load"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
