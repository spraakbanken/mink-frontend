import { parse, stringify } from "yaml";

const FORMATS = {
  txt: "text_import:parse",
  xml: "xml_import:parse",
  odt: "odt_import:parse",
  docx: "docx_import:parse",
};

export const FORMATS_EXT = Object.keys(FORMATS);

export function makeConfig(id, options) {
  const { format, name, description } = options;
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
    name: config.metadata.name,
    description: config.metadata.description,
    format: Object.keys(FORMATS).find(
      (ext) => FORMATS[ext] == config.import.importer
    ),
  };
}
