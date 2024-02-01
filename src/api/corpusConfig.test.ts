import { describe, expect, test } from "vitest";
import { makeConfig } from "./corpusConfig";

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

