export type AppContext = {
  projectName: string;
  dbContextName: string;
  basePath: string;
};

export type ColumnTypes =
  | "string"
  | "number"
  | "boolean"
  | "datetime"
  | "password";

export type Column = {
  name: string;
  type: ColumnTypes;
};

export type Entity = {
  name: string;
  plural: string;
  columns: Column[];
  relations?: {
    target: string;
    has: "one" | "many";
  }[];
};

export type EntityWithoutPlural = Omit<Entity, "plural">;

export type CodeGenerator = (entities: Entity[], metaData: AppContext) => void;

export interface Scaffolder {
  addGenerator: (_: CodeGenerator) => Scaffolder;
  addEntity: (_: EntityWithoutPlural) => Scaffolder;
  generate: () => void;
}
