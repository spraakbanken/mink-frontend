import { afterEach } from "node:test";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { delay } from "es-toolkit";
import {
  addDays,
  deduplicateRequest,
  enarray,
  ensureExtension,
  formatDate,
  getFilenameExtension,
  objsToDict,
  pathJoin,
  randomString,
  retry,
  setKeys,
  unarray,
} from "@/util";

describe("addDays", () => {
  const d = new Date("2024-04-24 08:00");
  const getYmd = (date: Date) => date.toISOString().slice(0, 10);
  test("adds days", () => {
    expect(getYmd(addDays(d, 10))).toBe("2024-05-04");
    expect(getYmd(addDays(d, -31))).toBe("2024-03-24");
  });
});

describe("enarray", () => {
  test("leaves array unchanged", () => {
    expect(enarray([1, 2, 3])).toStrictEqual([1, 2, 3]);
    expect(enarray([1])).toStrictEqual([1]);
    expect(enarray([])).toStrictEqual([]);
  });
  test("turns non-array into array", () => {
    expect(enarray("A")).toStrictEqual(["A"]);
    expect(enarray("ABC")).toStrictEqual(["ABC"]);
    expect(enarray(null)).toStrictEqual([null]);
    expect(enarray(undefined)).toStrictEqual([undefined]);
    expect(enarray(new Set([1, 2, 3]))).toStrictEqual([new Set([1, 2, 3])]);
  });
});

describe("formatDate", () => {
  // Ensure the test runs in a known timezone
  beforeEach(() => {
    vi.stubEnv("TZ", "Europe/Stockholm");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("formats a date", () => {
    // Date in UTC in winter
    const dateStrWinter = "2022-11-30T12:44:37Z";
    // Date in UTC in summer, should have DST applied when formatted
    const dateStrSummer = "2022-06-30T12:44:37Z";
    // Date with timezone offset (UTC-6 in winter)
    const dateStrOffset = "2022-11-30T12:44:37-06:00";

    // Localize to Swedish
    expect(formatDate(dateStrWinter, "sv")).toBe(
      "30 november 2022 kl. 13:44:37",
    );
    expect(formatDate(dateStrSummer, "sv")).toBe("30 juni 2022 kl. 14:44:37");
    expect(formatDate(dateStrOffset, "sv")).toBe(
      "30 november 2022 kl. 19:44:37",
    );

    // Localize to English (US)
    expect(formatDate(dateStrWinter, "en")).toBe(
      "November 30, 2022 at 1:44:37 PM",
    );
  });
});

describe("ensureExtension", () => {
  test("adds extension", () => {
    expect(ensureExtension("foo/bar", "zip")).toBe("foo/bar.zip");
  });
  test("changes extension", () => {
    expect(ensureExtension("foo/bar.baz.txt", "zip")).toBe("foo/bar.baz.zip");
  });
  test("handles hidden files", () => {
    expect(ensureExtension(".DS_Store", "zip")).toBe(".DS_Store.zip");
  });
  test("handles dots in dir", () => {
    expect(ensureExtension("foo.bar/baz.txt", "zip")).toBe("foo.bar/baz.zip");
  });
});

describe("pathJoin", () => {
  test("joins paths", () => {
    expect(pathJoin("a", "b")).toBe("a/b");
    expect(pathJoin("//a//", "//b//")).toBe("a/b");
  });
});

describe("retry", () => {
  test("default 3 times", async () => {
    let count: number = 0;
    const f = async () => {
      count += 1;
      throw Error("f error");
    };
    await expect(async () => await retry(f)).rejects.toThrowError("f error");
    expect(count).toBe(3);
  });

  test("adjustable number of times", async () => {
    let count: number = 0;
    const f = async () => {
      count += 1;
      throw Error("f error");
    };
    await expect(async () => await retry(f, 5)).rejects.toThrowError("f error");
    expect(count).toBe(5);
  });

  test("finishes on success", async () => {
    let count: number = 0;
    const f = async () => {
      count += 1;
      if (count == 1) throw Error("This is caught and ignored");
      return "hello";
    };
    expect(await retry(f)).toBe("hello");
    expect(count).toBe(2);
  });
});

describe("setKeys", () => {
  test("adds and removes in-place", () => {
    const a = { a: 1, b: 2 };
    expect(setKeys(a, ["b", "c"], 10)).toEqual({ b: 2, c: 10 });
    expect(a).toEqual({ b: 2, c: 10 });
  });
});

describe("randomString", () => {
  test("1000 samples match [0-9a-z]", () => {
    const pattern = new RegExp(/^[0-9a-z]+$/);
    const samples = Array.from({ length: 1000 }, () => randomString());
    const fails = samples.filter((s) => !pattern.test(s));
    expect(fails).toEqual([]);
  });
});

describe("getFilenameExtension", () => {
  test("one extension", () => {
    const filename = "palakpaneer.txt";
    const extension = getFilenameExtension(filename);
    expect(extension).toBe("txt");
  });
  test("no extension", () => {
    const filename = "marinara";
    const extension = getFilenameExtension(filename);
    expect(extension).toBe("");
  });
  test("two extensions", () => {
    const filename = "svt.xml.bz2";
    const extension = getFilenameExtension(filename);
    expect(extension).toBe("bz2");
  });
});

describe("unarray", () => {
  test("an array", () => {
    expect(unarray(["x", "y"])).toBe("x");
  });
  test("not an array", () => {
    expect(unarray("x")).toBe("x");
  });
  test("empty list", () => {
    expect(unarray([])).toBe(undefined);
  });
  test("empty arg", () => {
    expect(unarray(null)).toBe(null);
    expect(unarray(undefined)).toBe(undefined);
  });
});

describe("objsToDict", () => {
  test("simple", () => {
    const objs = [
      { k: "a", v: "A" },
      { k: "b", v: "B" },
    ];
    const dict = { a: "A", b: "B" };
    expect(objsToDict(objs, "k", "v")).toEqual(dict);
  });
  test("empty", () => {
    expect(objsToDict([], "a", "b")).toEqual({});
  });
  test("superfluous", () => {
    const objs = [{ k: "a", v: "A", x: "X" }];
    const dict = { a: "A" };
    expect(objsToDict(objs, "k", "v")).toEqual(dict);
  });
  test("missing key", () => {
    // @ts-expect-error The key "k" is missing in the object
    const dict = objsToDict([{ v: "A" }], "k", "v");
    expect(dict).toEqual({ undefined: "A" });
  });
  test("missing value", () => {
    // @ts-expect-error The key "v" is missing in the object
    const dict = objsToDict([{ k: "a" }], "k", "v");
    expect(dict).toEqual({ a: undefined });
  });
});

describe("deduplicateRequest", () => {
  let count = 0;
  const request = deduplicateRequest(async () => {
    count += 1;
    await delay(100);
    return count;
  });

  beforeEach(() => {
    count = 0;
  });

  test("deduplicates", async () => {
    const a = request();
    // Call again while first request is still pending.
    const b = request();

    // Only one request is sent.
    expect(count).toEqual(1);
    expect(await a).toEqual(1);
    expect(await b).toEqual(1);
  });

  test("is reusable", async () => {
    // Call and let it finish.
    const a = request();
    expect(count).toEqual(1);
    expect(await a).toEqual(1);

    // First request is done, it can now be called again.
    const b = request();
    expect(count).toEqual(2);
    expect(await b).toEqual(2);
  });

  test("uses args", async () => {
    const counts = { A: 0, B: 0 };

    const request = deduplicateRequest(async (key: keyof typeof counts) => {
      counts[key] += 1;
      await delay(100);
      return counts[key];
    });

    const a1 = request("A"); // add to A
    const a2 = request("A"); // skip this, do NOT add again to A
    const b1 = request("B"); // add to B
    const b2 = b1.then(() => request("B")); // add to B again

    expect(await a1).toEqual(1);
    expect(await a2).toEqual(1);
    expect(await b1).toEqual(1);
    expect(await b2).toEqual(2);
  });
});
