import { METHOD_COLORS } from "../../dashboard-constants";
import type { ArchNode, EndpointMap, HttpMethod } from "../../dashboard-types";
import { Sec } from "../TinyHelpers";

const METHOD_FILTERS = ["ALL", "GET", "POST", "PUT", "DELETE", "PATCH"] as const;

export function EndpointsSection({
  nodes,
  endpointsByNode,
  methodFilter,
  onChangeMethodFilter,
}: {
  nodes: ArchNode[];
  endpointsByNode: EndpointMap;
  methodFilter: HttpMethod | "ALL";
  onChangeMethodFilter: (method: HttpMethod | "ALL") => void;
}) {
  const allEndpoints = Object.entries(endpointsByNode).flatMap(
    ([nodeId, endpoints]) =>
      endpoints
        .filter(
          (endpoint) =>
            methodFilter === "ALL" || endpoint.method === methodFilter,
        )
        .map((endpoint) => ({
          ...endpoint,
          nodeName: nodes.find((node) => node.id === nodeId)?.label || nodeId,
        })),
  );

  return (
    <Sec label={`ENDPOINTS (${allEndpoints.length})`} right="−">
      <div style={{ display: "flex", gap: "3px", marginBottom: "7px", flexWrap: "wrap" }}>
        {METHOD_FILTERS.map((method) => (
          <button
            key={method}
            onClick={() => onChangeMethodFilter(method)}
            style={{
              background:
                methodFilter === method
                  ? method === "ALL"
                    ? "#1e2d4a"
                    : METHOD_COLORS[method].bg
                  : "transparent",
              border: `1px solid ${methodFilter === method ? "#3b7dd8" : "#1a2d4a"}`,
              borderRadius: "4px",
              color: methodFilter === method ? "#e2e8f0" : "#475569",
              fontSize: "8px",
              padding: "1px 5px",
              cursor: "pointer",
              fontWeight: 600,
              fontFamily: "monospace",
            }}
          >
            {method}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "3px",
          maxHeight: "160px",
          overflowY: "auto",
        }}
      >
        {allEndpoints.slice(0, 20).map((endpoint, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              padding: "3px 5px",
              background: "#0a1221",
              borderRadius: "4px",
              border: "1px solid #1a2d4a",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  background: METHOD_COLORS[endpoint.method].bg,
                  color: METHOD_COLORS[endpoint.method].text,
                  fontSize: "7px",
                  padding: "0 3px",
                  borderRadius: "2px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  minWidth: "30px",
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {endpoint.method}
              </span>
              <span
                style={{
                  color: "#64748b",
                  fontSize: "8.5px",
                  fontFamily: "monospace",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {endpoint.path}
              </span>
            </div>
            <span style={{ color: "#334155", fontSize: "8px", paddingLeft: "2px" }}>
              {endpoint.nodeName}
            </span>
          </div>
        ))}
      </div>
    </Sec>
  );
}
