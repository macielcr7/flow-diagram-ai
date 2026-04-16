import { METHOD_COLORS } from "../../dashboard-constants";
import type { Endpoint } from "../../dashboard-types";

export function NodeEndpointsSection({ endpoints }: { endpoints: Endpoint[] }) {
  if (endpoints.length === 0) return null;

  return (
    <div style={{ padding: "8px 10px", borderBottom: "1px solid #1a2d4a" }}>
      <div
        style={{
          color: "#475569",
          fontSize: "9px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          marginBottom: "6px",
        }}
      >
        Endpoints ({endpoints.length})
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        {endpoints.map((endpoint, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{
                background: METHOD_COLORS[endpoint.method].bg,
                color: METHOD_COLORS[endpoint.method].text,
                fontSize: "7.5px",
                padding: "1px 4px",
                borderRadius: "3px",
                fontFamily: "monospace",
                fontWeight: 700,
                minWidth: "36px",
                textAlign: "center",
                flexShrink: 0,
              }}
            >
              {endpoint.method}
            </span>
            <span
              style={{
                color: "#94a3b8",
                fontSize: "9.5px",
                fontFamily: "monospace",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {endpoint.path}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
