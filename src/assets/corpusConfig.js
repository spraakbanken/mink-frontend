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
      "<sentence>:misc.id",
      "<token>:saldo.baseform",
      "<token>:hunpos.pos",
      "<token>:sensaldo.sentiment_label",
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
    config.export.annotations.push("<text>:misc.date");
  }

  return yaml.dump(config);
}

export function makeEmptyConfig(corpusId) {
  return makeConfig(corpusId, {
    name: { swe: "", eng: "" },
    description: { swe: "", eng: "" },
  });
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
