export function downloadFile(data, filename) {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
}

export function formatDate(dateStr) {
  return dateStr.split("+")[0].replace("T", " ");
}

export function ensureExtension(filename, ext) {
  return filename.replace(/.[^.]*$/, "") + "." + ext;
}
