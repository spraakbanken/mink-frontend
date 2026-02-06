import axios, {
  isAxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { attempt, clone, pickBy, trim } from "es-toolkit";

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

/** Get files from an `<input type="file">` element, pass them to a handler, and unless the handling fails, empty the input. */
export async function handleFileInput(
  event: Event,
  fileHandler: (files: File[]) => Promise<void>,
): Promise<void> {
  // Get content as FileList
  const fileInput = event.target as HTMLInputElement;
  if (!fileInput.files) throw new RangeError("No file found in the file input");

  // Convert from FileList to File[]
  const files = [...fileInput.files];

  // Delegate to handler
  await fileHandler(files);

  // Upon success, empty the input value to enable selecting the same file again.
  fileInput.value = "";
}

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

/** Converts and formats a date to the given locale */
export function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleString(locale, {
    dateStyle: "long", // Spell out month name to avoid ambiguity with M/D/Y in English
    timeStyle: "medium", // With seconds but not timezone details
  });
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
export const pathJoin = (...parts: string[]) =>
  parts.map((part) => trim(part, "/")).join("/");

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

/** pickBy with additional type info for when the predicate is a type-checker */
// Tests not needed, as this only adds type information on top of pickBy.
export const pickByType = <V, U extends V, T extends Record<string, V>>(
  obj: T,
  shouldPick: (value: V, key: keyof T) => value is U,
) => pickBy(obj, shouldPick) as Record<keyof T, U>;

/** Create a random string of around 11 chars in the [0-9a-z] range. */
export const randomString = () => Math.random().toString(36).slice(2);

/** Returns the last part after the period ("."), or empty string if there is none */
export const getFilenameExtension = (filename: string) =>
  filename.split(".").slice(1).pop() || "";

/** If an array, return first element, or undefined if empty. If not an array, return the whole argument. */
export const unarray = <T>(x: T[] | T): T | undefined =>
  Array.isArray(x) ? x[0] : x;

/** Create dictionary by picking a key and a value from each object in a list. */
export const objsToDict = <
  T extends Record<K, string> & Record<VK, unknown>,
  K extends PropertyKey,
  VK extends PropertyKey,
>(
  objs: T[],
  keyName: K,
  valueName: VK,
) => Object.fromEntries(objs.map((item) => [item[keyName], item[valueName]]));

/** Make an Axios request and handle timeout by retrying with a higher limit. */
export async function progressiveTimeout<T, D = unknown>(
  config: AxiosRequestConfig<D>,
  options: { timeoutInit?: number; tries?: number } = {},
): Promise<AxiosResponse<T>> {
  let timeout = options.timeoutInit || 1000;
  let tries = options.tries || 3;

  const request = (): Promise<AxiosResponse<T>> =>
    axios.request<T>({ ...config, timeout }).catch((error: unknown) => {
      const isTimeout =
        isAxiosError(error) &&
        error.code == "ECONNABORTED" &&
        /^timeout/.test(error.message);

      // If timeout, retry with higher limit.
      if (isTimeout && tries > 0) {
        timeout *= 4;
        tries--;
        return request();
      }

      // Rethrow any other error.
      throw error;
    });

  return request();
}

/** Squash simultaneous runs of a time-consuming function. */
export function deduplicateRequest<T, P extends unknown[]>(
  f: (...args: P) => Promise<T>,
) {
  // Store one promise at a time, keyed by stringified args.
  const promises: Record<string, Promise<T>> = {};

  return (...args: P) => {
    // Determine what key to store this promise under.
    const key = attempt(() => JSON.stringify(args))[1] || "";

    // If a request is already in progress, return that promise.
    if (promises[key]) return promises[key];

    // Otherwise, start a new request and let it occupy the promise slot.
    const promise = f(...args).finally(() => delete promises[key]);
    promises[key] = promise;
    return promise;
  };
}
