import Yaml from "js-yaml";

import type { ByLang } from "@/util.types";
import type {
  ConfigSentenceSegmenter,
  SparvConfig,
} from "@/api/sparvConfig.types";

export type FileFormat = "txt" | "xml" | "odt" | "docx" | "pdf";

/** Frontend-internal format of a Sparv config. */
export type ConfigOptions = {
  format: FileFormat;
  name: ByLang;
  description?: ByLang;
  textAnnotation?: string;
  sentenceSegmenter?: ConfigSentenceSegmenter;
  datetimeFrom?: string;
  datetimeTo?: string;
  enableNer?: boolean;
};

const FORMATS: Record<FileFormat, string> = {
  txt: "text_import:parse",
  xml: "xml_import:parse",
  odt: "odt_import:parse",
  docx: "docx_import:parse",
  pdf: "pdf_import:parse",
};

export const FORMATS_EXT = Object.keys(FORMATS);

export const SEGMENTERS: ConfigSentenceSegmenter[] = ["linebreaks"];

export function makeConfig(id: string, options: ConfigOptions): string {
  const {
    format,
    name,
    description,
    textAnnotation,
    sentenceSegmenter,
    datetimeFrom,
    datetimeTo,
    enableNer,
  } = options;

  const config: Partial<SparvConfig> = {
    metadata: {
      id,
      name,
      description,
    },
  };

  if (!format) {
    throw new TypeError("File format must be set.");
  }

  config.import = {
    importer: FORMATS[format],
  };

  if (sentenceSegmenter) {
    config.segment = { sentence_segmenter: sentenceSegmenter };
  }

  config.export = {
    annotations: [
      "<token>:saldo.baseform2 as lemma",
      "<token>:saldo.lemgram as lex",
      "<token>:wsd.sense",
      "<token>:saldo.compwf",
      "<token>:saldo.complemgram",
      "<token>:stanza.dephead_ref as dephead",
      "<token>:stanza.ufeats",
      "<token>:stanza.deprel",
      "<token>:stanza.msd",
      "<token>:stanza.pos",
      "<token>:stanza.ref",
      "<token>:sensaldo.sentiment_score",
      "<token>:sensaldo.sentiment_label",
      "<token>:lexical_classes.blingbring",
      "<token>:lexical_classes.swefn",
      "<token>:misc.tail as _tail",
      "<token>:misc.head as _head",
      "<sentence>:misc.id",
      "<text>:lexical_classes.blingbring",
      "<text>:lexical_classes.swefn",
      "<text>:readability.lix",
      "<text>:readability.ovix",
      "<text>:readability.nk",
      "<text>:misc.source",
      "<text>:misc.id as _id",
    ],
  };

  if (format == "xml") {
    // The text annotation setting is required if XML, but it may be set later
    if (textAnnotation) {
      config.import.text_annotation = textAnnotation;
      config.export.source_annotations = [`${textAnnotation} as text`, "..."];
    }
  } else if (format == "pdf") {
    config.export.source_annotations = ["text", "page:number"];
  }

  if (datetimeFrom || datetimeTo) {
    if (!datetimeFrom || !datetimeTo) {
      throw new TypeError("Both or none of the timespan dates must be set.");
    }
    config.dateformat = {
      datetime_from: "<text>:misc.datefrom",
      datetime_to: "<text>:misc.dateto",
      datetime_informat: "%Y-%m-%d",
    };
    config.custom_annotations = [
      {
        annotator: "misc:constant",
        params: {
          out: "<text>:misc.datefrom",
          chunk: "<text>",
          value: datetimeFrom,
        },
      },
      {
        annotator: "misc:constant",
        params: {
          out: "<text>:misc.dateto",
          chunk: "<text>",
          value: datetimeTo,
        },
      },
    ];
    config.export.annotations!.push(
      "<text>:dateformat.datefrom",
      "<text>:dateformat.dateto",
      "<text>:dateformat.timefrom",
      "<text>:dateformat.timeto",
    );
  }

  // Enable named entity recognition.
  if (enableNer) {
    config.export.annotations!.push(
      "swener.ne",
      "swener.ne:swener.name",
      "swener.ne:swener.ex",
      "swener.ne:swener.type",
      "swener.ne:swener.subtype",
    );
  }

  return Yaml.dump(config as SparvConfig);
}

export function emptyConfig(): ConfigOptions {
  return {
    name: { swe: "", eng: "" },
    description: { swe: "", eng: "" },
    format: "txt",
  };
}

/**
 * Parse a Sparv config YAML string.
 *
 * May throw all kinds of errors, the sky is the limit.
 */
export function parseConfig(configYaml: string): ConfigOptions {
  const config = Yaml.load(configYaml) as any;

  if (!config)
    throw new TypeError(`Parsing config failed, returned "${config}"`);

  // Throw specific errors if required parts are missing.
  if (!config.import?.importer) throw new TypeError(`Importer setting missing`);
  const format = (Object.keys(FORMATS) as FileFormat[]).find(
    (ext) => FORMATS[ext as FileFormat] == config.import.importer,
  );
  if (!format)
    throw new TypeError(`Unrecognized importer: "${config.import.importer}"`);

  const name = config.metadata?.name;
  if (!name)
    throw new TypeError(`Name missing in metadata: ${config.metadata}`);
  if (!name.swe || !name.eng)
    throw new TypeError(`Name must contain swe and eng: ${name}`);

  return {
    format,
    name,
    description: config.metadata.description,
    textAnnotation: config.import?.text_annotation,
    sentenceSegmenter: config.segment?.sentence_segmenter,
    datetimeFrom: config.custom_annotations?.find(
      (a: any) => a.params.out == "<text>:misc.datefrom",
    )?.params.value,
    datetimeTo: config.custom_annotations?.find(
      (a: any) => a.params.out == "<text>:misc.dateto",
    )?.params.value,
    enableNer: config.export?.annotations?.includes("swener.ne"),
  };
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
