import { Entity, AppContext } from "../../types";
import {
  GenerateCode,
  ContextSubstitutions,
  WriteCodeToFile,
} from "../../utils";

const GenDbSet = (entity: Entity) => {
  return `      modelBuilder.EntitySet<${entity.name}>("${entity.name}");`;
};

export const OdataModelBuilderGenerator = async (
  entity: Entity[],
  meta: AppContext
) => {
  const code = await GenerateCode({
    template: `${__dirname}/templates/OdataModelBuilder.txt`,
    substitutions: new Map([
      ["ENTITY_SETS", entity.map((e) => GenDbSet(e)).join("\n")],
      ...ContextSubstitutions(meta),
    ]),
  });

  WriteCodeToFile(`Data/OdataModel.cs`, code, meta);
};
