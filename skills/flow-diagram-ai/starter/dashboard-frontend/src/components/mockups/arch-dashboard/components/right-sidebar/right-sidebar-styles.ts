import type { CSSProperties } from "react";

export function actionButtonStyles(
  background = "#0f1a2f",
  border = "#1a2d4a",
  color = "#94a3b8",
): CSSProperties {
  return {
    width: "100%",
    background,
    border: `1px solid ${border}`,
    borderRadius: "6px",
    color,
    fontSize: "10px",
    fontWeight: 600,
    padding: "7px 8px",
    cursor: "pointer",
    textAlign: "left",
  };
}
