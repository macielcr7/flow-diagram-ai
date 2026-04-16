import type { ReactNode } from "react";

export function Pill({
  color,
  bg,
  border,
  children,
}: {
  color: string;
  bg: string;
  border: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: "20px",
        padding: "2px 9px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <span style={{ color, fontSize: "10.5px", fontWeight: 500 }}>{children}</span>
    </div>
  );
}

export function Sec({
  label,
  sub,
  right,
  children,
}: {
  label: string;
  sub?: string;
  right?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ padding: "10px 10px 8px", borderBottom: "1px solid #1a2d4a" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "7px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
          <span
            style={{
              color: "#64748b",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
          {sub && <span style={{ color: "#334155", fontSize: "8px" }}>{sub}</span>}
        </div>
        {right && <span style={{ color: "#475569", fontSize: "11px" }}>{right}</span>}
      </div>
      {children}
    </div>
  );
}
