import { Entity } from "../../../types";
import { TypeScriptTypesMap } from "../../../utils";

export const TypeDefenitionCode = (entity: Entity) => {
  const properties = entity.columns
    .map((c) => `  ${c.name}: ${TypeScriptTypesMap.get(c.type)};`)
    .join("\n");

  return `
export type ${entity.name} = {
  Id: Number;
  CreatedAt: string;
  UpdatedAt: string;
${properties}
}
  `;
};
