import { Entity, AppContext } from "../../../types";
import { WriteCodeToFile } from "../../../utils";
import { TypeDefenitionCode } from "./TypeDefenitionCode";

export const TypeScriptTypes = (entities: Entity[], context: AppContext) => {
  const generated = entities
    .map((entity) => TypeDefenitionCode(entity))
    .join("\n");

  WriteCodeToFile("Frontend/Types.ts", generated, context);
};
