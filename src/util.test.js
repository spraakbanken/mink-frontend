import { describe, expect, test } from "vitest";
import { ensureExtension, formatDate, formatSeconds, pathJoin } from "./util";

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
