import { pick } from "lodash";
import round from "lodash/round";

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
  return dateStr.substr(0, 19).replace("T", " ");
}

export function formatSeconds(secs) {
  secs = round(secs);
  return secs < 60
    ? `${secs} s`
    : `${Math.floor(secs / 60)} min ${secs % 60} s`;
}

export function ensureExtension(filename, ext) {
  return filename.replace(/(.+)\.[^/.]*$/, "$1") + "." + ext;
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

/** Remove and add properties in `obj`, to match names in `keys`.
 * The returned object is derived from a shallow copy.
 */
export function setKeys(obj, keys, defaultValue = null) {
  // Remove non-matching items.
  obj = pick(obj, keys);

  // Add new items.
  for (const key of keys) {
    obj[key] = obj[key] || defaultValue;
  }

  return obj;
}
