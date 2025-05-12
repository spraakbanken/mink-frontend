import * as A from "./annotators.types";
import annotatorsFile from "@/assets/annotators.json";

export const data = (annotatorsFile as unknown as A.File).annotators;

type Listing = {
  key: string;
  module: string;
  moduleDef: A.Module;
  func: string;
  funcDef: FuncDef;
};
type FuncDef = A.Annotator & {
  descriptionShort?: string;
  descriptionRest?: string;
};
type AnalysisListing = Listing & { funcDef: A.Analysis };
type CustomListing = Listing & { type: "custom"; funcDef: A.Custom };
/** An analysis can yield multiple annotations. An annotation belongs to an analysis. */
type AnnotationListing = Listing & {
  type: "annotation";
  funcDef: A.Analysis;
  annotation: string;
  annotationDef: A.Annotation;
};
export type CustomObject = {
  id: string;
  moduleName: string;
  functionName: string;
  annotator: A.Custom;
  parameters: Record<string, unknown>;
};
export type DecoratedConfig = A.Config & { _namespace: string; _name: string };

export const annotators: Listing[] = Object.entries(data).flatMap(
  ([module, moduleDef]) =>
    Object.entries(moduleDef.functions).flatMap(([func, funcDef]) => ({
      key: func,
      module,
      moduleDef,
      func,
      funcDef: {
        ...funcDef,
        descriptionShort: funcDef.description?.replace(/\n[\s\S]*/m, ""),
        descriptionRest: funcDef.description?.replace(/[^\n]*\n*/, ""),
      },
    })),
);

export const analyses = annotators.filter(({ funcDef }) =>
  A.isAnalysis(funcDef),
) as AnalysisListing[];

export const customs = annotators
  .filter(({ funcDef }) => A.isCustom(funcDef))
  .map((item) => ({ ...item, type: "custom" })) as CustomListing[];

export const annotations: AnnotationListing[] = analyses.flatMap((a) =>
  Object.entries(a.funcDef.annotations).map(([annotation, annotationDef]) => ({
    ...a,
    type: "annotation",
    key: annotation,
    annotation,
    annotationDef,
  })),
);

export const annotationOptions = [...annotations, ...customs].sort((a, b) =>
  a.key.localeCompare(b.key),
);

export const getAnalysis = (
  moduleName: string,
  functionName: string,
): A.Analysis => {
  const annotator = data[moduleName].functions[functionName];
  if (!A.isAnalysis(annotator)) throw new Error("Not an analysis");
  return annotator;
};

export const getCustom = (
  moduleName: string,
  functionName: string,
): A.Custom => {
  const annotator = data[moduleName].functions[functionName];
  if (!A.isCustom(annotator)) throw new Error("Not a custom annotator");
  return annotator;
};

function findFunctions(annotation: string) {
  const found: [string, string][] = [];
  for (const module in data) {
    const functions = data[module].functions;
    for (const func in functions) {
      if (A.isAnalysis(functions[func])) {
        if (functions[func].annotations[annotation]) found.push([module, func]);
      }
    }
  }
  return found;
}

export function findAnnotationDefs(annotation: string) {
  return findFunctions(annotation).flatMap(([module, func]) =>
    getAnalysis(module, func),
  );
}

export function decorateConfig(
  configMap: Record<string, A.Config>,
): Record<string, DecoratedConfig> {
  const decorated: Record<string, DecoratedConfig> = {};
  for (const name in configMap) {
    const [_namespace, _name] = name.split(".");
    decorated[name] = { ...configMap[name], _namespace, _name };
  }
  return decorated;
}
