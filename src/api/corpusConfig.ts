import Yaml from "js-yaml";
import {
  analysisAnnotations,
  annotationAnalyses,
  loadAnalysisMetdata,
  type AnalysisId,
} from "./analysis";
import type {
  ConfigSentenceSegmenter,
  SparvConfig,
} from "@/api/sparvConfig.types";
import type { ByLang } from "@/util.types";

export type FileFormat =
  | "txt"
  | "xml"
  | "odt"
  | "docx"
  | "pdf"
  | "mp3"
  | "ogg"
  | "wav";

/** Frontend-internal format of a Sparv config. */
export type ConfigOptions = {
  format: FileFormat;
  name?: ByLang;
  description?: ByLang;
  textAnnotation?: string;
  sentenceSegmenter?: ConfigSentenceSegmenter;
  datetime?: {
    from: string;
    to: string;
  };
  // Options to disable/enable analyses
  analyses: Record<AnalysisId, boolean>;
};

const FORMATS: Record<FileFormat, string> = {
  txt: "text_import:parse",
  xml: "xml_import:parse",
  odt: "odt_import:parse",
  docx: "docx_import:parse",
  pdf: "pdf_import:parse",
  mp3: "sbx_whisper_import:parse_mp3",
  ogg: "sbx_whisper_import:parse_ogg",
  wav: "sbx_whisper_import:parse_wav",
};

export const FORMATS_EXT = Object.keys(FORMATS);

export const SEGMENTERS: ConfigSentenceSegmenter[] = ["linebreaks"];

/** Write simplified frontend-internal config model to a Sparv-compatible config YAML. */
export function makeConfig(id: string, options: ConfigOptions): string {
  const {
    format,
    name,
    description,
    textAnnotation,
    sentenceSegmenter,
    datetime,
    analyses,
  } = options;

  if (!format) {
    throw new TypeError("File format must be set.");
  }

  const config: SparvConfig = {
    metadata: {
      id,
      name,
      description,
    },
    import: {
      importer: FORMATS[format],
    },
    export: {},
  };

  if (sentenceSegmenter)
    config.segment = { sentence_segmenter: sentenceSegmenter };

  // Format-dependent settings
  if (format == "xml") {
    // The text annotation setting is required if XML, but it may be set later
    if (textAnnotation) {
      config.import.text_annotation = textAnnotation;
      config.export.source_annotations = [`${textAnnotation} as text`, "..."];
    }
  } else if (format == "pdf") {
    config.export.source_annotations = ["text", "page:number"];
  }

  // Annotations
  config.export.annotations = [
    "<token>:misc.tail as _tail",
    "<token>:misc.head as _head",
    "<sentence>:misc.id",
    "<text>:misc.source",
    "<text>:misc.id as _id",
  ];

  // Add annotation definitions for each enabled analysis
  const enabledAnalysisIds = Object.keys(analyses).filter((id) => analyses[id]);
  for (const analysisId of enabledAnalysisIds) {
    const annotations = analysisAnnotations[analysisId];
    if (annotations) config.export.annotations.push(...annotations);
  }

  if (datetime) {
    // Add annotations on the text level with custom values
    config.custom_annotations = [
      {
        annotator: "misc:constant",
        params: {
          out: "<text>:misc.datefrom",
          chunk: "<text>",
          value: datetime.from,
        },
      },
      {
        annotator: "misc:constant",
        params: {
          out: "<text>:misc.dateto",
          chunk: "<text>",
          value: datetime.to,
        },
      },
    ];

    // Enable annotations from the `dateformat` module
    config.export.annotations.push(
      "<text>:dateformat.datefrom",
      "<text>:dateformat.dateto",
      "<text>:dateformat.timefrom",
      "<text>:dateformat.timeto",
    );

    // Configure the annotators to use the custom attributes
    config.dateformat = {
      datetime_from: "<text>:misc.datefrom",
      datetime_to: "<text>:misc.dateto",
      datetime_informat: "%Y-%m-%d",
    };
  }

  return Yaml.dump(config as SparvConfig, { noArrayIndent: true });
}

/** Default values */
export async function emptyConfig(): Promise<ConfigOptions> {
  // Let all analyses be enabled by default, except NER because it is heavy, and Geo because it depends on NER.
  const disabledAnalyses = [
    "sbx-swe-namedentity-swener",
    "sbx-swe-geotagcontext-sparv",
  ];
  return {
    name: { swe: "", eng: "" },
    description: { swe: "", eng: "" },
    format: "txt",
    datetime: undefined,
    analyses: Object.fromEntries(
      (await loadAnalysisMetdata()).map((analysis) => [
        analysis.id,
        !disabledAnalyses.includes(analysis.id),
      ]),
    ),
  };
}

/**
 * Parse a Sparv config YAML string.
 *
 * This is designed to reinflate a yaml written by `makeConfig()`.
 * When parsing a hand-written yaml, the result may be incomplete or excessive.
 *
 * May throw all kinds of errors, the sky is the limit (:
 */
export async function parseConfig(configYaml: string): Promise<ConfigOptions> {
  const config = Yaml.load(configYaml) as unknown as Partial<SparvConfig>;

  if (!config)
    throw new TypeError(`Parsing config failed, returned "${config}"`);

  // Throw specific errors if required parts are missing.
  if (!config.import?.importer) throw new TypeError(`Importer setting missing`);
  const format = (Object.keys(FORMATS) as FileFormat[]).find(
    (ext) => FORMATS[ext as FileFormat] == config.import?.importer,
  );
  if (!format)
    throw new TypeError(
      `Unrecognized importer: "${JSON.stringify(config.import.importer)}"`,
    );

  // Extract metadata
  const name = config.metadata?.name;

  // Build options object
  const options = {
    ...(await emptyConfig()),
    format,
    name,
    description: config.metadata?.description,
    textAnnotation: config.import.text_annotation,
    sentenceSegmenter: config.segment?.sentence_segmenter,
  };

  // Identify annotations
  const datetimeFrom = config.custom_annotations?.find(
    (a) => a.params?.out == "<text>:misc.datefrom",
  )?.params?.value;
  const datetimeTo = config.custom_annotations?.find(
    (a) => a.params?.out == "<text>:misc.dateto",
  )?.params?.value;
  if (
    datetimeFrom &&
    typeof datetimeFrom == "string" &&
    datetimeTo &&
    typeof datetimeTo == "string"
  )
    options.datetime = { from: datetimeFrom, to: datetimeTo };

  options.analyses = {};

  for (const annotation of config.export?.annotations || []) {
    const analysisId = annotationAnalyses[annotation];
    if (analysisId) options.analyses[analysisId] = true;
  }

  return options;
}

/** Check if the config looks ready to run. May throw anything. */
export function validateConfig(config: ConfigOptions) {
  if (!config.format) {
    throw new TypeError("Format missing");
  }

  if (config.format == "xml" && !config.textAnnotation) {
    throw new TypeError("Text annotation setting is required for XML");
  }
}
