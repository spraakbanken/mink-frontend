declare module "vue-matomo";

/** @see https://github.com/cloudflare/json-schema-tools/blob/master/workspaces/json-schema-walker/README.md */
declare module "@cloudflare/json-schema-walker" {
  export type Visitor = (
    schema: import("json-schema").JSONSchema6 | boolean,
    path: string[],
    parent?: import("json-schema").JSONSchema6,
    parentPath?: string[],
  ) => void;

  /** Modifies in place */
  export function schemaWalk(
    schema: import("json-schema").JSONSchema6,
    preFunc?: Visitor,
    postFunc?: Visitor,
    vocabulary?: any,
  ): void;
}
