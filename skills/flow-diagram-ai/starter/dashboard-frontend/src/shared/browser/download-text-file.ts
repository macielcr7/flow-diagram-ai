type DownloadTextFileOptions = {
  filename: string;
  text: string;
  type?: string;
};

export function downloadTextFile({
  filename,
  text,
  type = "application/json;charset=utf-8",
}: DownloadTextFileOptions) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 0);
}
