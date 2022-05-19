import { parse, stringify } from "yaml";

export function makeConfig(id, options) {
  const { format, name, description } = options;
  const config = {
    metadata: {
      id,
      name,
      description,
    },
  };

  if (format == "txt") {
    config["import"] = { importer: "text_import:parse" };
  }

  config["export"] = {
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
    name: config["metadata"]["name"],
    description: config["metadata"]["description"],
    format:
      config["import"] && config["import"]["importer"] == "text_import:parse"
        ? "txt"
        : "xml",
  };
}
