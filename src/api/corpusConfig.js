const yaml = import("js-yaml").then((m) => m.default);

const FORMATS = {
  txt: "text_import:parse",
  xml: "xml_import:parse",
  odt: "odt_import:parse",
  docx: "docx_import:parse",
  pdf: "pdf_import:parse",
};

export const FORMATS_EXT = Object.keys(FORMATS);

export const SEGMENTERS = ["linebreaks"];

export async function makeConfig(id, options) {
  const {
    format,
    name,
    description,
    textAnnotation,
    sentenceSegmenter,
    datetimeFrom,
    datetimeTo,
  } = options;
  const config = {
    metadata: {
      id,
      name,
      description,
    },
  };

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
    config.export.annotations.push(
      "<text>:dateformat.datefrom",
      "<text>:dateformat.dateto",
      "<text>:dateformat.timefrom",
      "<text>:dateformat.timeto"
    );
  }

  return (await yaml).dump(config);
}

export function emptyConfig() {
  return {
    name: { swe: "", eng: "" },
    description: { swe: "", eng: "" },
  };
}

export async function parseConfig(configYaml) {
  const config = (await yaml).load(configYaml);
  return {
    name: config.metadata?.name,
    description: config.metadata?.description,
    format: Object.keys(FORMATS).find(
      (ext) => FORMATS[ext] == config.import?.importer
    ),
    textAnnotation: config.import?.text_annotation,
    sentenceSegmenter: config.segment?.sentence_segmenter,
    datetimeFrom: config.custom_annotations?.find(
      (a) => a.params.out == "<text>:misc.datefrom"
    ).params.value,
    datetimeTo: config.custom_annotations?.find(
      (a) => a.params.out == "<text>:misc.dateto"
    ).params.value,
  };
}

/** Check if the config looks ready to run. May throw anything. */
export function validateConfig(config) {
  if (!config.format) {
    throw new TypeError("Format missing");
  }

  if (config.format == "xml" && !config.textAnnotation) {
    throw new TypeError("Text annotation setting is required for XML");
  }
}
