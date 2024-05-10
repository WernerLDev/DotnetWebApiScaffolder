import pluralize from "pluralize";
import { Entity, ProjectMeta } from "../types";
import { GenerateCode, MetaSubstitutions, WriteCodeToFile } from "../utils";

const GenDbSet = (entity: Entity) => {
  return `      modelBuilder.EntitySet<${entity.name}>("${entity.name}");`;
};

export const OdataModelBuilderGenerator = async (
  entity: Entity[],
  meta: ProjectMeta
) => {
  const code = await GenerateCode({
    template: `${__dirname}/templates/OdataModelBuilder.txt`,
    substitutions: new Map([
      ["ENTITY_SETS", entity.map((e) => GenDbSet(e)).join("\n")],
      ...MetaSubstitutions(meta),
    ]),
  });

  WriteCodeToFile(`Data/OdataModel.cs`, code, meta);
};
