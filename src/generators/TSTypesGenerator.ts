import { Entity, ProjectMeta } from "../types";
import {
  EntitySubstitutions,
  GenerateCode,
  TypeScriptTypesMap,
  WriteCodeToFile,
} from "../utils";

export const TypeScriptTypesGenerator = async (
  entities: Entity[],
  meta: ProjectMeta
) => {
  const generated = entities.map((entity) => {
    const properties = entity.columns
      .map((c) => `  ${c.name}: ${TypeScriptTypesMap.get(c.type)};`)
      .join("\n");

    return GenerateCode({
      template: `${__dirname}/templates/TypeScriptType.txt`,
      substitutions: new Map([
        ["ENTITY_COLUMNS", properties],
        ...EntitySubstitutions(entity),
      ]),
    });
  });

  const output = (await Promise.all(generated)).join("\n");
  WriteCodeToFile("Frontend/Types.ts", output, meta);
};
