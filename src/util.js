export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

/** Join path segments and normalize.
 *
 * Similar to Node.js path.join but not as complete.
 */
export function pathJoin(...parts) {
  return parts
    .map((part) => part.replace(/^\/+/, "").replace(/\/+$/, ""))
    .join("/");
}
