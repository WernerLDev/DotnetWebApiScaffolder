import pluralize from "pluralize";
import { Entity, ProjectMeta } from "../types";
import { GenerateCode, MetaSubstitutions, WriteCodeToFile } from "../utils";

const GenDbSet = (entity: Entity) => {
  const plural = pluralize(entity.name);
  return `      public DbSet<${entity.name}> ${plural} { get; set; }`;
};

export const DbContextGenerator = async (
  entity: Entity[],
  meta: ProjectMeta
) => {
  const code = await GenerateCode({
    template: `${__dirname}/templates/DBContext.txt`,
    substitutions: new Map([
      ["DB_SETS", entity.map((e) => GenDbSet(e)).join("\n")],
      ...MetaSubstitutions(meta),
    ]),
  });

  WriteCodeToFile(`Data/${meta.dbContextName}.cs`, code, meta);
};
