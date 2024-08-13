import { describe, expect, test } from "vitest";
import Yaml from "js-yaml";
import {
  makeConfig,
  parseConfig,
  type ConfigOptions,
  validateConfig,
} from "@/api/corpusConfig";

describe("makeConfig", () => {
  test("sets minimal info", () => {
    const yaml = makeConfig("mink-abc123", {
      name: { swe: "Nyheter", eng: "News" },
      format: "txt",
    });
    expect(yaml).toContain("id: mink-abc123");
    expect(yaml).toContain("swe: Nyheter");
    expect(yaml).toContain("eng: News");
    expect(yaml).toContain("importer: text_import:parse");
    expect(yaml).toContain("- <token>:saldo.baseform2 as lemma");
  });

  test("sets segmenter", () => {
    const yaml = makeConfig("mink-abc123", {
      name: { swe: "Nyheter", eng: "News" },
      format: "txt",
      sentenceSegmenter: "linebreaks",
    });
    expect(yaml).toContain("sentence_segmenter: linebreaks");
  });

  test("sets text_annotation", () => {
    const yaml = makeConfig("mink-abc123", {
      name: { swe: "Nyheter", eng: "News" },
      format: "xml",
      textAnnotation: "article",
    });
    expect(yaml).toContain("text_annotation: article");
    expect(yaml).toContain("- article as text");
  });

  test("sets pdf annotations", () => {
    const yaml = makeConfig("mink-abc123", {
      name: { swe: "Nyheter", eng: "News" },
      format: "pdf",
    });
    expect(yaml).toContain("- text");
    expect(yaml).toContain("- page:number");
  });

  test("requires complete timespan", () => {
    const yamlFrom = () =>
      makeConfig("mink-abc123", {
        name: { swe: "Nyheter", eng: "News" },
        format: "pdf",
        datetimeFrom: "2024-02-01",
      });
    expect(yamlFrom).toThrowError();

    const yamlTo = () =>
      makeConfig("mink-abc123", {
        name: { swe: "Nyheter", eng: "News" },
        format: "pdf",
        datetimeTo: "2024-02-01",
      });
    expect(yamlTo).toThrowError();
  });

  test("sets timespan info", () => {
    const yaml = makeConfig("mink-abc123", {
      name: { swe: "Nyheter", eng: "News" },
      format: "pdf",
      datetimeFrom: "2000-01-01",
      datetimeTo: "2023-12-31",
    });
    expect(yaml).toContain("datetime_from: <text>:misc.datefrom");
    expect(yaml).toContain("datetime_to: <text>:misc.dateto");
    expect(yaml).toContain("datetime_informat: '%Y-%m-%d'");
    expect(yaml).toContain("value: '2000-01-01'");
    expect(yaml).toContain("value: '2023-12-31'");
    expect(yaml).toContain("- <text>:dateformat.datefrom");
  });

  test("sets NER info", () => {
    const yaml = makeConfig("mink-abc123", {
      name: { swe: "Nyheter", eng: "News" },
      format: "pdf",
      enableNer: true,
    });
    expect(yaml).toContain("- swener.ne:swener.name");
  });
});

describe("parseConfig", () => {
  test("handle minimal info", () => {
    const configYaml = Yaml.dump({
      metadata: { name: { swe: "Nyheter", eng: "News" } },
      import: { importer: "text_import:parse" },
    });
    const config = parseConfig(configYaml);
    expect(config.name).toStrictEqual({ swe: "Nyheter", eng: "News" });
    expect(config.format).toBe("txt");
  });

  test("requires format", () => {
    const configYaml = Yaml.dump({
      metadata: { name: { swe: "Nyheter", eng: "News" } },
    });
    expect(() => parseConfig(configYaml)).toThrowError();
  });

  test("requires name", () => {
    const configYaml = Yaml.dump({
      import: { importer: "text_import:parse" },
    });
    expect(() => parseConfig(configYaml)).toThrowError();
  });

  test("handle full info", () => {
    const configYaml = Yaml.dump({
      metadata: {
        name: { swe: "Nyheter", eng: "News" },
        description: { swe: "Senaste nytt", eng: "Latest news" },
      },
      import: {
        importer: "xml_import:parse",
        text_annotation: "article",
      },
      segment: { sentence_segmenter: "linebreaks" },
      custom_annotations: [
        { params: { out: "<text>:misc.datefrom", value: "2000-01-01" } },
        { params: { out: "<text>:misc.dateto", value: "2023-12-31" } },
      ],
      export: {
        annotations: ["swener.ne"],
      },
    });
    const config = parseConfig(configYaml);
    const expected: ConfigOptions = {
      format: "xml",
      name: { swe: "Nyheter", eng: "News" },
      description: { swe: "Senaste nytt", eng: "Latest news" },
      textAnnotation: "article",
      sentenceSegmenter: "linebreaks",
      datetimeFrom: "2000-01-01",
      datetimeTo: "2023-12-31",
      enableNer: true,
    };
    expect(config).toStrictEqual(expected);
  });
});

describe("validateConfig", () => {
  test("missing text annotation", () => {
    const options: ConfigOptions = {
      name: { swe: "Nyheter", eng: "News" },
      format: "xml",
    };

    // Config can be handled
    makeConfig("mink-abc123", options);

    // But is not ready for annotation
    expect(() => validateConfig(options)).toThrow();
  });
});
