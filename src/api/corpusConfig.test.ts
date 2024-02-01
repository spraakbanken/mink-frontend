import { describe, expect, test } from "vitest";
import yaml from "js-yaml";
import { makeConfig, parseConfig, type ConfigOptions } from "./corpusConfig";

describe("makeConfig", () => {
  test("sets minimal info", async () => {
    const yaml = await makeConfig('mink-abc123', {
      name: {swe: "Nyheter", eng: "News"},
      format: "txt",
    })
    expect(yaml).toContain('id: mink-abc123')
    expect(yaml).toContain('swe: Nyheter')
    expect(yaml).toContain('eng: News')
    expect(yaml).toContain('importer: text_import:parse')
    expect(yaml).toContain('- <token>:saldo.baseform2 as lemma')
  });

  test("sets segmenter", async () => {
    const yaml = await makeConfig('mink-abc123', {
      name: {swe: "Nyheter", eng: "News"},
      format: "txt",
      sentenceSegmenter: "linebreaks"
    })
    expect(yaml).toContain('sentence_segmenter: linebreaks')
  });

  test("sets text_annotation", async () => {
    const yaml = await makeConfig('mink-abc123', {
      name: {swe: "Nyheter", eng: "News"},
      format: "xml",
      textAnnotation: "article"
    })
    expect(yaml).toContain("text_annotation: article")
    expect(yaml).toContain("- article as text")
  });

  test("sets pdf annotations", async () => {
    const yaml = await makeConfig('mink-abc123', {
      name: {swe: "Nyheter", eng: "News"},
      format: "pdf",
    })
    expect(yaml).toContain("- text")
    expect(yaml).toContain("- page:number")
  });

  test("requires complete timespan", async () => {
    const yamlFrom = () => makeConfig('mink-abc123', {
      name: {swe: "Nyheter", eng: "News"},
      format: "pdf",
      datetimeFrom: "2024-02-01",
    })
    expect(yamlFrom).rejects.toThrowError()

    const yamlTo = () => makeConfig('mink-abc123', {
      name: {swe: "Nyheter", eng: "News"},
      format: "pdf",
      datetimeTo: "2024-02-01",
    })
    expect(yamlTo).rejects.toThrowError()
  });

  test("sets timespan info", async () => {
    const yaml = await makeConfig('mink-abc123', {
      name: {swe: "Nyheter", eng: "News"},
      format: "pdf",
      datetimeFrom: "2000-01-01",
      datetimeTo: "2023-12-31",
    })
    expect(yaml).toContain("datetime_from: <text>:misc.datefrom")
    expect(yaml).toContain("datetime_to: <text>:misc.dateto")
    expect(yaml).toContain("datetime_informat: '%Y-%m-%d'")
    expect(yaml).toContain("value: '2000-01-01'")
    expect(yaml).toContain("value: '2023-12-31'")
    expect(yaml).toContain("- <text>:dateformat.datefrom")
  });

  test("sets NER info", async() => {
    const yaml = await makeConfig('mink-abc123', {
      name: {swe: "Nyheter", eng: "News"},
      format: "pdf",
      enableNer: true,
    })
    expect(yaml).toContain("- swener.ne:swener.name")

  })
});

describe("parseConfig", () => {
  test("handle minimal info", async () => {
    const configYaml = await yaml.dump({
      metadata: { name: {swe: "Nyheter", eng: "News" } },
      import: {importer: "text_import:parse"}
    })
    const config = await parseConfig(configYaml)
    expect(config.name).toStrictEqual({swe: "Nyheter", eng: "News"})
    expect(config.format).toBe('txt')
  });

  test("requires format", async () => {
    const configYaml = await yaml.dump({
      metadata: { name: {swe: "Nyheter", eng: "News" } }
    })
    expect(() => parseConfig(configYaml)).rejects.toThrowError()
  });

  test("requires name", async () => {
    const configYaml = await yaml.dump({
      import: {importer: "text_import:parse"}
    })
    expect(() => parseConfig(configYaml)).rejects.toThrowError()
  });

  test("handle full info", async () => {
    const configYaml = await yaml.dump({
      metadata: {
        name: {swe: "Nyheter", eng: "News" },
        description: {swe: "Senaste nytt", eng: "Latest news"},
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
      }
    })
    const config = await parseConfig(configYaml)
    const expected: ConfigOptions = {
      format: "xml",
      name: {swe: "Nyheter", eng: "News" },
      description: {swe: "Senaste nytt", eng: "Latest news"},
      textAnnotation: "article",
      sentenceSegmenter: "linebreaks",
      datetimeFrom: "2000-01-01",
      datetimeTo: "2023-12-31",
      enableNer: true
    }
    expect(config).toStrictEqual(expected)
  });
});