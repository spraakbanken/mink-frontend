import { parse, stringify } from "yaml";

export function makeConfig(id, options) {
  const { format, name, description } = options;
  const config = {
    metadata: {
      id,
      name: { eng: name, swe: name },
      description: { eng: description, swe: description },
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
