import { Sec } from "../TinyHelpers";

export function SettingsSection({
  editMode,
  onChangeEditMode,
  animOn,
  onChangeAnimOn,
}: {
  editMode: boolean;
  onChangeEditMode: (value: boolean) => void;
  animOn: boolean;
  onChangeAnimOn: (value: boolean) => void;
}) {
  return (
    <Sec label="SETTINGS" right="−">
      <div style={{ marginBottom: "8px" }}>
        <span
          style={{
            color: "#334155",
            fontSize: "9px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontWeight: 700,
            display: "block",
            marginBottom: "5px",
          }}
        >
          Mode
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          {(["view", "edit"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onChangeEditMode(mode === "edit")}
              style={{
                flex: 1,
                background:
                  (mode === "edit") === editMode ? "#1e3a5f" : "transparent",
                border: `1px solid ${
                  (mode === "edit") === editMode ? "#2563eb" : "#1a2d4a"
                }`,
                borderRadius: "5px",
                color:
                  (mode === "edit") === editMode ? "#60a5fa" : "#475569",
                fontSize: "10px",
                padding: "4px",
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <span
          style={{
            color: "#334155",
            fontSize: "9px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontWeight: 700,
            display: "block",
            marginBottom: "5px",
          }}
        >
          Animation
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          {[{ label: "Arrow", value: true }, { label: "Static", value: false }].map(
            (mode) => (
              <button
                key={String(mode.value)}
                onClick={() => onChangeAnimOn(mode.value)}
                style={{
                  flex: 1,
                  background: animOn === mode.value ? "#1e3a5f" : "transparent",
                  border: `1px solid ${
                    animOn === mode.value ? "#2563eb" : "#1a2d4a"
                  }`,
                  borderRadius: "5px",
                  color: animOn === mode.value ? "#60a5fa" : "#475569",
                  fontSize: "10px",
                  padding: "4px",
                  cursor: "pointer",
                }}
              >
                {mode.label}
              </button>
            ),
          )}
        </div>
      </div>
    </Sec>
  );
}
