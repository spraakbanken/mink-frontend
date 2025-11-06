import Yaml from "js-yaml";
import type { AnnotationGroup } from "@/api/analysis";
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
  annotations: {
    // Options to disable/enable predefined groups of annotations
    [K in AnnotationGroup]?: boolean;
  };
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
    annotations,
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

  if (annotations.lexicalClasses) {
    config.export.annotations.push(
      "<token>:lexical_classes.blingbring",
      "<token>:lexical_classes.swefn",
      "<text>:lexical_classes.blingbring",
      "<text>:lexical_classes.swefn",
    );
  }

  if (annotations.msd) {
    config.export.annotations.push(
      "<token>:stanza.msd",
      "<token>:stanza.pos",
      "<token>:stanza.ufeats",
    );
  }

  if (annotations.readability) {
    config.export.annotations.push(
      "<text>:readability.lix",
      "<text>:readability.ovix",
      "<text>:readability.nk",
    );
  }

  if (annotations.saldo) {
    config.export.annotations.push(
      "<token>:saldo.baseform2 as lemma",
      "<token>:saldo.lemgram as lex",
      "<token>:saldo.compwf",
      "<token>:saldo.complemgram",
    );
  }

  if (annotations.sensaldo) {
    config.export.annotations.push(
      "<token>:sensaldo.sentiment_score",
      "<token>:sensaldo.sentiment_label",
    );
  }

  // Enable named entity recognition.
  if (annotations.swener) {
    config.export.annotations.push(
      "swener.ne",
      "swener.ne:swener.name",
      "swener.ne:swener.ex",
      "swener.ne:swener.type",
      "swener.ne:swener.subtype",
      "<sentence>:geo.geo_context as _geocontext",
    );
  }

  if (annotations.syntax) {
    config.export.annotations.push(
      "<token>:stanza.dephead_ref as dephead",
      "<token>:stanza.deprel",
      "<token>:stanza.ref",
    );
  }

  if (annotations.wsd) {
    config.export.annotations.push("<token>:wsd.sense");
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
export function emptyConfig(): ConfigOptions {
  return {
    name: { swe: "", eng: "" },
    description: { swe: "", eng: "" },
    format: "txt",
    datetime: undefined,
    annotations: {
      lexicalClasses: true,
      readability: true,
      saldo: true,
      sensaldo: true,
      syntax: true,
      msd: true,
      swener: false,
      wsd: true,
    },
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
export function parseConfig(configYaml: string): ConfigOptions {
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
    ...emptyConfig(),
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

  options.annotations.lexicalClasses = config.export?.annotations?.includes(
    "<token>:lexical_classes.swefn",
  );
  options.annotations.msd =
    config.export?.annotations?.includes("<token>:stanza.msd");
  options.annotations.readability = config.export?.annotations?.includes(
    "<text>:readability.lix",
  );
  options.annotations.saldo = config.export?.annotations?.includes(
    "<token>:saldo.baseform2 as lemma",
  );
  options.annotations.sensaldo = config.export?.annotations?.includes(
    "<token>:sensaldo.sentiment_score",
  );
  options.annotations.swener =
    config.export?.annotations?.includes("swener.ne");
  options.annotations.syntax = config.export?.annotations?.includes(
    "<token>:stanza.dephead_ref as dephead",
  );
  options.annotations.wsd =
    config.export?.annotations?.includes("<token>:wsd.sense");

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
