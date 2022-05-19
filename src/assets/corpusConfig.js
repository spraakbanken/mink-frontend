import { parse, stringify } from "yaml";

const FORMATS = {
  txt: "text_import:parse",
  xml: "xml_import:parse",
  odt: "odt_import:parse",
  docx: "docx_import:parse",
};

export const FORMATS_EXT = Object.keys(FORMATS);

export function makeConfig(id, options) {
  const { format, name, description, textAnnotation } = options;
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
    config.import.document_annotation = textAnnotation;
  }

  config.export = {
    annotations: [
      "<sentence>:misc.id",
      "<token>:saldo.baseform",
      "<token>:hunpos.pos",
      "<token>:sensaldo.sentiment_label",
    ],
  };

  return stringify(config);
}

export function parseConfig(yaml) {
  const config = parse(yaml);
  return {
    name: config.metadata?.name,
    description: config.metadata?.description,
    format: Object.keys(FORMATS).find(
      (ext) => FORMATS[ext] == config.import?.importer
    ),
    textAnnotation: config.import?.document_annotation,
  };
}
