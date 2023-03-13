import yaml from "js-yaml";

const FORMATS = {
  txt: "text_import:parse",
  xml: "xml_import:parse",
  odt: "odt_import:parse",
  docx: "docx_import:parse",
};

export const FORMATS_EXT = Object.keys(FORMATS);

export const SEGMENTERS = ["linebreaks"];

export function makeConfig(id, options) {
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

  if (format === "xml") {
    if (!textAnnotation) {
      throw new TypeError("Text annotation setting is required for XML");
    }
    config.import.text_annotation = textAnnotation;
  }

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
      // Korp needs the document annotation to be called "text"
      "<text> as text",
    ],
  };

  if (datetimeFrom || datetimeTo) {
    if (!datetimeFrom && datetimeTo) {
      throw new TypeError("Both or none of the dates must be set.");
    }
    config.dateformat = {
      datetime_from: "<text>:misc.datefrom",
      datetime_to: "<text>:misc.dateto",
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
      "<text>:misc.datefrom",
      "<text>:misc.dateto"
    );
  }

  return yaml.dump(config);
}

export function emptyConfig() {
  return {
    name: { swe: "", eng: "" },
    description: { swe: "", eng: "" },
  };
}

export function parseConfig(configYaml) {
  const config = yaml.load(configYaml);
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
