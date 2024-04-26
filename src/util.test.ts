import { describe, expect, test } from "vitest";
import {
  addDays,
  enarray,
  ensureExtension,
  formatDate,
  formatSeconds,
  getException,
  getFilenameExtension,
  keyBy,
  objsToDict,
  pathJoin,
  randomString,
  retry,
  setKeys,
  unarray,
} from "@/util";

describe("addDays", () => {
  const d = new Date("2024-04-24 08:00");
  const getYmd = (date: Date) => date.toISOString().slice(0,10)
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
  test("formats a date", () => {
    expect(formatDate("2022-11-30T12:44:37.735Z")).toBe("2022-11-30 12:44:37");
  });
});

describe("formatSeconds", () => {
  test("less than a minute", () => {
    expect(formatSeconds(59.4)).toBe("59 s");
  });
  test("a minute", () => {
    expect(formatSeconds(59.5)).toBe("1 min 0 s");
  });
  test("more than two minutes", () => {
    expect(formatSeconds(121)).toBe("2 min 1 s");
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

describe("getException", () => {
  test("translate success to undefined", () => {
    const f = () => "foobar";
    const exception = getException(f);
    expect(exception).toBeUndefined();
  });
  test("reflect exception", () => {
    const f = () => {
      throw new EvalError("Leverpastej");
    };
    const exception = getException(f);
    expect(exception.name).toBe("EvalError");
    expect(exception.message).toBe("Leverpastej");
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
  test("empty arg"),
    () => {
      expect(unarray(null)).toBe(null);
      expect(unarray(undefined)).toBe(undefined);
    };
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
    // @ts-expect-error
    const dict = objsToDict([{ v: "A" }], "k", "v");
    expect(dict).toEqual({ undefined: "A" });
  });
  test("missing value", () => {
    // @ts-expect-error
    const dict = objsToDict([{ k: "a" }], "k", "v");
    expect(dict).toEqual({ a: undefined });
  });
});

describe("keyBy", () => {
  test("string keys", () => {
    const objs = [
      { name: "Alice", age: 40 },
      { name: "Bob", age: 50 },
    ];
    const dict = {
      Alice: { name: "Alice", age: 40 },
      Bob: { name: "Bob", age: 50 },
    };
    expect(keyBy(objs, "name")).toEqual(dict);
  });
  test("number keys", () => {
    const objs = [
      { name: "Alice", age: 40 },
      { name: "Bob", age: 50 },
    ];
    const dict = {
      40: { name: "Alice", age: 40 },
      50: { name: "Bob", age: 50 },
    };
    expect(keyBy(objs, "age")).toEqual(dict);
  });
  test("key collision", () => {
    const objs = [
      { name: "Alice", age: 40 },
      { name: "Bob", age: 40 },
    ];
    const dict = {
      40: { name: "Bob", age: 40 },
    };
    expect(keyBy(objs, "age")).toEqual(dict);
  });
  test("key missing", () => {
    const objs = [{ age: 40 }];
    const dict = { undefined: { age: 40 } };
    // @ts-expect-error
    expect(keyBy(objs, "name")).toEqual(dict);
  });
});
