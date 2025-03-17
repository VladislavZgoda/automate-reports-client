export default function downloadFile(blob: Blob, fileName: string) {
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = fileUrl;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(fileUrl);
}
