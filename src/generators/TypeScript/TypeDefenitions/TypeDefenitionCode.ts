import { Entity } from "../../../types";
import { TypeScriptTypesMap } from "../../../utils";

export const TypeDefenitionCode = (entity: Entity) => {
  return `
export type ${entity.name} = {
  Id: Number;
  CreatedAt: string;
  UpdatedAt: string;
${entity.columns
  .map((c) => `  ${c.name}: ${TypeScriptTypesMap.get(c.type)};`)
  .join("\n")}
}
  `;
};
