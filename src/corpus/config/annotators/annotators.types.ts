/** The structure of the annotators file. */
export type File = {
  annotators: {
    [moduleName: string]: Module;
  };
};

/** The content of each module section. */
export type Module = {
  description: string;
  functions: {
    [functionName: string]: Annotator;
  };
};

/** An annotator is either an Analysis or a Custom annotator. */
export type Annotator = Analysis | Custom;

export const isCustom = (annotator: Annotator): annotator is Custom =>
  "custom_annotator" in annotator;

export const isAnalysis = (annotator: Annotator): annotator is Analysis =>
  !isCustom(annotator);

/** A type of annotator that can be enabled/disabled, and performs some analysis. */
export type Analysis = {
  description: string;
  /** One Analysis kan give multiple annotations. */
  annotations: {
    [annotationName: string]: Annotation;
  };
  /** The Analysis can be configured with these fields. */
  config?: {
    [configName: string]: Config;
  };
};

/** A type of annotator that can be added multiple times and adds an attribute, by using parameters rather than an analysis algorithm. */
export type Custom = {
  description: string;
  custom_annotator: true;
  /** Parameters for the Custom annotator. Usually at least a target chunk and new attribute name. */
  parameters: {
    [parameterName: string]: Parameter;
  };
};

/** Describes the output of an Analysis. An Analysis can yield multiple Annotations. */
export type Annotation = {
  description: string;
  resolved_name?: string;
  class?: string;
};

/** A configuration field for an Analysis. */
export type Config = {
  description: string;
  default?: string | number | boolean | null;
  /** A required field has one type, an optional field has the primary type plus "NoneType". */
  datatype: [ConfigType] | [ConfigType, "NoneType"];
  choices?: string[];
};

/** Describes a Custom annotator parameter. */
export type Parameter<T extends ValueType = ValueType> = {
  optional: boolean;
  type: ParamType;
  default: T;
};

export type ValueType = string | number | boolean | null;
export type ConfigType = "bool" | "float" | "int" | "str";
export type ParamType =
  | ConfigType
  | "dict"
  | `list[${string}]`
  | "Annotation"
  | "Output"
  | "_empty";
