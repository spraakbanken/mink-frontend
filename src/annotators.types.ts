export type File = {
  annotators: {
    [moduleName: string]: Module;
  };
};

export type Module = {
  description: string;
  functions: {
    [functionName: string]: Annotator;
  };
};

export type Annotator = Analysis | Custom;

export const isCustom = (annotator: Annotator): annotator is Custom =>
  "custom_annotator" in annotator;

export const isAnalysis = (annotator: Annotator): annotator is Analysis =>
  !isCustom(annotator);

export type Analysis = {
  description: string;
  annotations: {
    [annotationName: string]: Annotation;
  };
  config?: {
    [configName: string]: Config;
  };
};

export type Custom = {
  description: string;
  custom_annotator: true;
  parameters: {
    [parameterName: string]: Parameter;
  };
};

export type Annotation = {
  description: string;
  resolved_name?: string;
  class?: string;
};

export type Config = {
  description: string;
  default?: string | number | boolean | null;
  datatype: string[];
  choices?: string[];
};

export type Parameter<T extends ValueType = ValueType> = {
  optional: boolean;
  type: string;
  default: T;
};

export type ValueType = string | number | boolean | null;
