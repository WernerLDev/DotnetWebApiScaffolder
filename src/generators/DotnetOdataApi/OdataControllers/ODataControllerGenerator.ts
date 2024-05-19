import { Entity, AppContext } from "../../../types";
import {
  EntitySubstitutions,
  GenerateCode,
  ContextSubstitutions,
  WriteCodeToFile,
} from "../../../utils";

export const OdataGenerator = (entities: Entity[], context: AppContext) => {
  entities.forEach(async (entity) => {
    const updates = entity.columns
      .map((c) => `    dbEntity.${c.name} = entity.${c.name};`)
      .join("\n");

    const code = await GenerateCode({
      template: `${__dirname}/OdataController.txt`,
      substitutions: new Map([
        ["ENTITY_UPDATE", updates],
        ...EntitySubstitutions(entity),
        ...ContextSubstitutions(context),
      ]),
    });

    WriteCodeToFile(
      `Controllers/Api/${entity.name}Controller.cs`,
      code,
      context
    );
  });
};
