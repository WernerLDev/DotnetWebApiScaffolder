import { Entity } from "../../../types";
import { TypeScriptTypesMap } from "../../../utils";

export const TypeDefenitionCode = (entity: Entity) => {
  return `export type ${entity.name} = {
${entity.columns
  .map((c) => `  ${c.name}: ${TypeScriptTypesMap.get(c.type)};`)
  .join("\n")}
  CreatedAt: string;
  UpdatedAt: string;
}
`;
};
