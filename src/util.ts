import clone from "lodash/clone";
import round from "lodash/round";

/** The number of milliseconds in a full day. */
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Add or subtract a number of days to a date
 *
 * Works with 24-hour cycles, so the hour (and possibly date) will change across DST changes.
 **/
export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_MS);
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Trigger a file download in the browser by adding a temporary link and click it */
export function downloadFile(data: string | Blob, filename: string) {
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

/** Leaves an array unchanged but returns [x] for a non-array value x. */
export const enarray = <T>(x: T | T[]): T[] => (Array.isArray(x) ? x : [x]);

/** Formats an ISO 8601 date as "YYYY-MM-DD hh:mm:ss" */
export function formatDate(dateStr: string) {
  return dateStr.slice(0, 19).replace("T", " ");
}

/** Formats a number of seconds as "X min Y s" */
export function formatSeconds(secs: number) {
  secs = round(secs);
  return secs < 60
    ? `${secs} s`
    : `${Math.floor(secs / 60)} min ${secs % 60} s`;
}

/** Add or change a filename extension */
export function ensureExtension(filename: string, ext: string) {
  return filename.replace(/(.+)\.[^/.]*$/, "$1") + "." + ext;
}

/** Add trailing slash to a URL if it doesn't already have one */
export function ensureTrailingSlash(url: string) {
  return url.replace(/\/*$/, "/");
}

/** Join path segments and normalize.
 *
 * Similar to Node.js path.join but not as complete.
 */
export function pathJoin(...parts: string[]) {
  return parts
    .map((part) => part.replace(/^\/+/, "").replace(/\/+$/, ""))
    .join("/");
}

/**
 * Calls an async function, and if it is rejected, retries a given number of times.
 *
 * @throws The last rejection if the number of retries is exhausted.
 */
export async function retry<T>(
  f: () => Promise<T>,
  retries: number = 3,
): Promise<T> {
  try {
    return await f();
  } catch (error) {
    if (retries - 1) return retry(f, retries - 1);
    else throw error;
  }
}

/** Remove and add properties in `obj` in-place, to match names in `keys`. */
export function setKeys<T>(
  obj: Record<string, T>,
  keys: string[],
  defaultValue: T,
) {
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
// TODO Use attempt and isError from Lodash instead
export const getException = (f: () => any): any | undefined => {
  try {
    f();
  } catch (e) {
    return e;
  }
  return undefined;
};

/** Returns the last part after the period ("."), or empty string if there is none */
export const getFilenameExtension = (filename: string) =>
  filename.split(".").slice(1).pop() || "";

/** If an array, return first element. Otherwise return the whole argument. */
export const unarray = <T>(x: T[] | T): T => (Array.isArray(x) ? x[0] : x);

/** Create {a: A, b: B} from [ {k: a, v: A}, {k: b, v: B} ] */
export const objsToDict = <
  T extends Record<keyof any, any>,
  K1 extends keyof T,
  K2 extends keyof T,
>(
  objs: T[],
  keyName: K1,
  valueName: K2,
): Record<T[K1], T[K2]> =>
  objs.reduce(
    (dict: Partial<Record<T[K1], T[K2]>>, item) => ({
      ...dict,
      [item[keyName]]: item[valueName],
    }),
    {},
  ) as Record<T[K1], T[K2]>;

/** Like lodash/keyBy but slightly more restrictive in range and typing. */
export const keyBy = <T extends Record<K, keyof any>, K extends keyof T>(
  objs: T[],
  prop: K,
): Record<T[K], T> =>
  objs.reduce(
    (obj, item) => ({ ...obj, [String(item[prop])]: item }),
    {} as Record<T[K], T>,
  );
