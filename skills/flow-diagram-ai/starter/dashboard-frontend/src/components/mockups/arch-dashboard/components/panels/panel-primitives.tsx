import type { CSSProperties, ReactNode } from "react";

export function PanelField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: "6px" }}>
      <div
        style={{
          color: "#475569",
          fontSize: "9px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "3px",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

export function PanelButton({
  children,
  color = "#1d4ed8",
  border = "#2563eb",
  text = "#93c5fd",
  full,
  onClick,
}: {
  children: ReactNode;
  color?: string;
  border?: string;
  text?: string;
  full?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: color,
        border: `1px solid ${border}`,
        borderRadius: "5px",
        color: text,
        fontSize: "11px",
        padding: "5px 10px",
        cursor: "pointer",
        width: full ? "100%" : "auto",
      }}
    >
      {children}
    </button>
  );
}

export function FloatingPanel({
  title,
  borderColor,
  titleColor,
  onClose,
  children,
  style,
}: {
  title: string;
  borderColor: string;
  titleColor: string;
  onClose: () => void;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "206px",
        width: "222px",
        background: "#0d1828",
        border: `1px solid ${borderColor}`,
        borderRadius: "10px",
        padding: "14px",
        zIndex: 200,
        boxShadow: "0 8px 32px #00000090",
        animation: "fadeIn .15s ease",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <span style={{ color: titleColor, fontSize: "12px", fontWeight: 700 }}>
          {title}
        </span>
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
        >
          ×
        </button>
      </div>
      {children}
    </div>
  );
}
