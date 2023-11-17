import { describe, expect, test } from "vitest";
import {
  ensureExtension,
  formatDate,
  formatSeconds,
  getException,
  pathJoin,
  randomString,
  setKeys,
} from "./util";

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
    expect(formatSeconds("121")).toBe("2 min 1 s");
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
