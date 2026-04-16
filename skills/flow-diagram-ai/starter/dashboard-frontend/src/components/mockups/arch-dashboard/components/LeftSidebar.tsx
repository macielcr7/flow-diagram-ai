import { ALL_TYPES, ICONS, NODE_TYPE_LABELS, T } from "../dashboard-constants";
import { Sec } from "./TinyHelpers";

export function LeftSidebar() {
  return (
    <div
      style={{
        width: "182px",
        flexShrink: 0,
        background: "#0b1628",
        borderRight: "1px solid #1a2d4a",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <Sec label="COMPONENTS" sub="drag to canvas">
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {ALL_TYPES.map((type) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("nodeType", type)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "5px 8px",
                background: "#0a1221",
                border: `1px solid ${T[type].border}30`,
                borderRadius: "6px",
                cursor: "grab",
                userSelect: "none",
                transition: "border-color .15s",
              }}
            >
              <span style={{ fontSize: "13px" }}>{ICONS[type]}</span>
              <span style={{ color: "#94a3b8", fontSize: "10px", fontWeight: 500 }}>
                {NODE_TYPE_LABELS[type]}
              </span>
              <span style={{ color: T[type].top, fontSize: "9px", marginLeft: "auto" }}>
                ⠿
              </span>
            </div>
          ))}
        </div>
      </Sec>
    </div>
  );
}
