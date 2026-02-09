import {
  Pair,
  parseDocument,
  Scalar,
  YAMLError,
  YAMLMap,
  type Node,
} from "yaml";
import Ajv2020, {
  type ErrorObject,
  type ValidateFunction,
} from "ajv/dist/2020";
import addFormats from "ajv-formats";

export type YamlValidatorError = {
  from: number;
  to: number;
  message: string;
};

/** Validate repeatedly with the same compiled Ajv validator for a given schema */
export default class YamlValidator {
  protected validator?: ValidateFunction;

  constructor(protected schema?: object) {
    if (schema) this.createValidator(schema);
  }

  createValidator(schema: object) {
    const ajv = new Ajv2020({ allowUnionTypes: true });
    // Add support for string formats (dates etc), see: https://ajv.js.org/packages/ajv-formats.html
    addFormats(ajv);
    this.validator = ajv.compile(schema);
  }

  /** Validate current YAML content against our JSON schema */
  validate(code: string): YamlValidatorError[] {
    // Skip if no content
    if (!code) return [];

    // Parse YAML
    const doc = parseDocument(code);

    // Abort and report parse errors
    if (doc.errors.length) {
      return doc.errors.map(YamlValidator.formatParseError);
    }

    // Check parsed data with schema validator if provided
    if (this.validator) {
      const data = doc.toJSON();
      this.validator(data);

      if (this.validator.errors) {
        // Empty document
        const root = doc.contents;
        if (!root) return [];

        return this.validator.errors.map((error) =>
          YamlValidator.formatSchemaError(root, error),
        );
      }
    }

    // Valid
    return [];
  }

  /** Reformat a YAML parse error object */
  static formatParseError(error: YAMLError): YamlValidatorError {
    return {
      from: error.pos[0],
      to: error.pos[1],
      message: error.message.replace(/ at line \d[\s\S]*/, ""),
    };
  }

  /** Reformat an Ajv error object */
  static formatSchemaError(root: Node, error: ErrorObject): YamlValidatorError {
    let message = error.message || "";

    // Add any params to message
    if (error.params) {
      for (const [key, value] of Object.entries(error.params)) {
        message += `\n${key}: ${value}`;
      }
    }

    // If document is not a map or sequence, mark beginning
    if (!("get" in root)) return { from: 0, to: root.range?.[2] ?? 0, message };

    // Translate path string to list of keys
    const path = error.instancePath.split("/").slice(1);

    // Follow path
    let node = path.length
      ? (root.getIn(path, true) as Node | undefined)
      : root;
    if (!node) throw new Error(`Invalid error path: ${error.instancePath}`);

    // Follow named subproperty if present
    const subkey: string | undefined =
      error.params.unevaluatedProperty || error.params.additionalProperty;

    // We cannot just add the key to the path, because that would yield the value, but we want the key
    if (subkey && node instanceof YAMLMap) {
      const pair = node.items.find(
        (item) => item.key instanceof Scalar && item.key.value == subkey,
      ) as Pair<Scalar, unknown>;
      node = pair.key;
    }

    const range = node.range || [0, 0, 0];
    return { from: range[0], to: range[2], message };
  }
}
