import clone from "lodash/clone";
import round from "lodash/round";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function downloadFile(data, filename) {
  // The url is temporary and bound to the window and document, and represents (does not contain) the data.
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static
  const url = window.URL.createObjectURL(new Blob([data]));

  // Create an invisible link element and "click" it. This makes the browser save the file.
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Clear the temporary url.
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

export function ensureTrailingSlash(url) {
  return url && url.replace(/\/*$/, "/");
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

/** Remove and add properties in `obj` in-place, to match names in `keys`. */
export function setKeys(obj, keys, defaultValue = null) {
  // Remove non-matching items.
  for (const key in obj) {
    if (!keys.includes(key)) {
      delete obj[key];
    }
  }

  // Add new items.
  for (const key of keys) {
    obj[key] = obj[key] || clone(defaultValue);
  }

  return obj;
}

/** Create a random string of around 11 chars in the [0-9a-z] range. */
export const randomString = () => Math.random().toString(36).slice(2);

/** Execute callback, catch and return any exception, otherwise return undefined. */
export const getException = (f) => {
  try {
    f();
  } catch (e) {
    return e;
  }
  return undefined;
};

export const getFilenameExtension = (filename) =>
  filename.split(".").slice(1).pop() || "";
