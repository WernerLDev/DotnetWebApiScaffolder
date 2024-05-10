import { Entity, ProjectMeta } from "../types";
import {
  EntitySubstitutions,
  GenerateCode,
  MetaSubstitutions,
  WriteCodeToFile,
} from "../utils";

export const OdataGenerator = (entities: Entity[], meta: ProjectMeta) => {
  entities.forEach(async (entity) => {
    const updates = entity.columns
      .map((c) => `    dbEntity.${c.name} = entity.${c.name};`)
      .join("\n");

    const code = await GenerateCode({
      template: `${__dirname}/templates/OdataController.txt`,
      substitutions: new Map([
        ["ENTITY_UPDATE", updates],
        ...EntitySubstitutions(entity),
        ...MetaSubstitutions(meta),
      ]),
    });

    WriteCodeToFile(`Controllers/Api/${entity.name}Controller.cs`, code, meta);
  });
};
