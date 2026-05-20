import { describe, expect, test } from "vitest";
import { stringify } from "yaml";
import {
  makeConfig,
  parseConfig,
  type ConfigOptions,
  validateConfig,
} from "@/api/corpusConfig";
import type { AnalysisRegistryService } from "@/analyses/analyses.types";

const analysisRegistryStub: AnalysisRegistryService = {
  loadMetadata: async () => [],
  getAnnotations: () => ["<text>:readability.lix"],
  getAnalyses: () => ["sbx-swe-readability-sparv-lix"],
  getDefaultAnalyses: async () => [],
};

describe("makeConfig", () => {
  test("sets minimal info", () => {
    const yaml = makeConfig(
      "mink-abc123",
      {
        name: { swe: "Nyheter", eng: "News" },
        format: "txt",
        analyses: {},
      },
      analysisRegistryStub,
    );
    expect(yaml).toContain("id: mink-abc123");
    expect(yaml).toContain("swe: Nyheter");
    expect(yaml).toContain("eng: News");
    expect(yaml).toContain("importer: text_import:parse");
    expect(yaml).not.toContain("- <token>:saldo.baseform2 as lemma");
  });

  test("sets segmenter", () => {
    const yaml = makeConfig(
      "mink-abc123",
      {
        name: { swe: "Nyheter", eng: "News" },
        format: "txt",
        sentenceSegmenter: "linebreaks",
        analyses: {},
      },
      analysisRegistryStub,
    );
    expect(yaml).toContain("sentence_segmenter: linebreaks");
  });

  test("sets text_annotation", () => {
    const yaml = makeConfig(
      "mink-abc123",
      {
        name: { swe: "Nyheter", eng: "News" },
        format: "xml",
        textAnnotation: "article",
        analyses: {},
      },
      analysisRegistryStub,
    );
    expect(yaml).toContain("text_annotation: article");
    expect(yaml).toContain("- article as text");
  });

  test("sets pdf annotations", () => {
    const yaml = makeConfig(
      "mink-abc123",
      {
        name: { swe: "Nyheter", eng: "News" },
        format: "pdf",
        analyses: {},
      },
      analysisRegistryStub,
    );
    expect(yaml).toContain("- text");
    expect(yaml).toContain("- page:number");
  });

  test("sets timespan info", () => {
    const yaml = makeConfig(
      "mink-abc123",
      {
        name: { swe: "Nyheter", eng: "News" },
        format: "pdf",
        datetime: {
          from: "2000-01-01",
          to: "2023-12-31",
        },
        analyses: {},
      },
      analysisRegistryStub,
    );
    expect(yaml).toContain("datetime_from: <text>:misc.datefrom");
    expect(yaml).toContain("datetime_to: <text>:misc.dateto");
    expect(yaml).toContain('datetime_informat: "%Y-%m-%d"');
    expect(yaml).toContain("value: 2000-01-01");
    expect(yaml).toContain("value: 2023-12-31");
    expect(yaml).toContain("- <text>:dateformat.datefrom");
  });
});

describe("parseConfig", () => {
  test("handle minimal info", () => {
    const configYaml = stringify({
      import: { importer: "text_import:parse" },
    });
    const config = parseConfig(configYaml, analysisRegistryStub);
    expect(config.format).toBe("txt");
  });

  test("requires format", () => {
    const configYaml = stringify({
      metadata: { name: { swe: "Nyheter", eng: "News" } },
    });
    expect(() => parseConfig(configYaml, analysisRegistryStub)).toThrowError();
  });

  test("handle full info", () => {
    const configYaml = stringify({
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
        annotations: ["<text>:readability.lix"],
      },
    });
    const config = parseConfig(configYaml, analysisRegistryStub);
    const expected: ConfigOptions = {
      format: "xml",
      name: { swe: "Nyheter", eng: "News" },
      description: { swe: "Senaste nytt", eng: "Latest news" },
      textAnnotation: "article",
      sentenceSegmenter: "linebreaks",
      datetime: {
        from: "2000-01-01",
        to: "2023-12-31",
      },
      analyses: {
        "sbx-swe-readability-sparv-lix": true,
      },
    };
    expect(config).toStrictEqual(expected);
  });
});

describe("validateConfig", () => {
  test("missing text annotation", () => {
    const options: ConfigOptions = {
      name: { swe: "Nyheter", eng: "News" },
      format: "xml",
      analyses: {},
    };

    // Config can be handled
    makeConfig("mink-abc123", options, analysisRegistryStub);

    // But is not ready for annotation
    expect(() => validateConfig(options)).toThrow();
  });
});
