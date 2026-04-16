import { useRef, type CSSProperties, type ChangeEvent } from "react";

import { formatDateTime } from "@/shared/formatters/format-date-time";

import type { SnapshotFeedback } from "../use-dashboard-snapshot";

type SnapshotEditorPanelProps = {
  jsonDraft: string;
  jsonError: string | null;
  jsonFeedback: SnapshotFeedback | null;
  snapshotId: string;
  updatedAt: string;
  onChangeDraft: (value: string) => void;
  onImportFile: (file: File) => void | Promise<void>;
  onLoadCurrent: () => void;
  onApply: () => void;
  onExport: () => void;
  onReset: () => void;
  onClose: () => void;
};

export function SnapshotEditorPanel({
  jsonDraft,
  jsonError,
  jsonFeedback,
  snapshotId,
  updatedAt,
  onChangeDraft,
  onImportFile,
  onLoadCurrent,
  onApply,
  onExport,
  onReset,
  onClose,
}: SnapshotEditorPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await onImportFile(file);
    event.target.value = "";
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "16px",
        right: "214px",
        width: "440px",
        background: "#0d1828",
        border: "1px solid #2563eb",
        borderRadius: "12px",
        padding: "14px",
        zIndex: 230,
        boxShadow: "0 12px 42px #00000099",
        animation: "fadeIn .15s ease",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleImportFile}
        style={{ display: "none" }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "10px",
        }}
      >
        <div>
          <div style={{ color: "#93c5fd", fontSize: "12px", fontWeight: 700 }}>
            Registered Snapshot JSON
          </div>
          <div style={{ color: "#475569", fontSize: "10px", marginTop: "3px" }}>
            {snapshotId} · atualizado em {formatDateTime(new Date(updatedAt))}
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
          gap: "6px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          style={buttonStyles("#0f172a", "#1d4ed8", "#93c5fd")}
          type="button"
        >
          Importar JSON
        </button>
        <button
          onClick={onLoadCurrent}
          style={buttonStyles("#0f172a", "#1e3a5f", "#cbd5e1")}
          type="button"
        >
          Carregar atual
        </button>
        <button
          onClick={onApply}
          style={buttonStyles("#14532d", "#22c55e", "#bbf7d0")}
          type="button"
        >
          Aplicar JSON
        </button>
        <button
          onClick={onExport}
          style={buttonStyles("#0f172a", "#14532d", "#86efac")}
          type="button"
        >
          Exportar JSON
        </button>
        <button
          onClick={onReset}
          style={buttonStyles("#450a0a", "#dc2626", "#fca5a5")}
          type="button"
        >
          Resetar base
        </button>
      </div>

      <textarea
        onChange={(event) => onChangeDraft(event.target.value)}
        spellCheck={false}
        style={{
          width: "100%",
          minHeight: "420px",
          resize: "vertical",
          background: "#07101f",
          border: `1px solid ${jsonError ? "#dc2626" : "#1e3a5f"}`,
          borderRadius: "8px",
          color: "#dbeafe",
          fontSize: "11px",
          lineHeight: 1.55,
          padding: "12px",
          outline: "none",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        }}
        value={jsonDraft}
      />

      {jsonError ? (
        <div
          style={{
            marginTop: "8px",
            borderRadius: "8px",
            border: "1px solid #7f1d1d",
            background: "#1f0b0b",
            color: "#fca5a5",
            fontSize: "10px",
            padding: "8px 10px",
            whiteSpace: "pre-wrap",
          }}
        >
          {jsonError}
        </div>
      ) : jsonFeedback ? (
        <div
          style={{
            marginTop: "8px",
            borderRadius: "8px",
            border: `1px solid ${
              jsonFeedback.tone === "success"
                ? "#14532d"
                : jsonFeedback.tone === "info"
                  ? "#1e3a5f"
                  : "#7f1d1d"
            }`,
            background:
              jsonFeedback.tone === "success"
                ? "#0f1f17"
                : jsonFeedback.tone === "info"
                  ? "#0f172a"
                  : "#1f0b0b",
            color:
              jsonFeedback.tone === "success"
                ? "#86efac"
                : jsonFeedback.tone === "info"
                  ? "#93c5fd"
                  : "#fca5a5",
            fontSize: "10px",
            padding: "8px 10px",
            whiteSpace: "pre-wrap",
          }}
        >
          {jsonFeedback.text}
        </div>
      ) : (
        <div style={{ color: "#475569", fontSize: "10px", marginTop: "8px" }}>
          O dashboard renderiza e edita este snapshot. A análise da IA será
          feita sobre esse mesmo JSON.
        </div>
      )}
    </div>
  );
}

function buttonStyles(
  background: string,
  border: string,
  color: string,
): CSSProperties {
  return {
    background,
    border: `1px solid ${border}`,
    borderRadius: "6px",
    color,
    fontSize: "10.5px",
    fontWeight: 600,
    padding: "6px 10px",
    cursor: "pointer",
  };
}
