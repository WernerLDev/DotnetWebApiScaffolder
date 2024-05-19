import pluralize from "pluralize";
import { Entity, AppContext } from "../../../types";
import {
  GenerateCode,
  ContextSubstitutions,
  WriteCodeToFile,
} from "../../../utils";

const GenDbSet = (entity: Entity) => {
  const plural = pluralize(entity.name);
  return `      public DbSet<${entity.name}> ${plural} { get; set; }`;
};

export const DbContextGenerator = async (
  entity: Entity[],
  context: AppContext
) => {
  const code = await GenerateCode({
    template: `${__dirname}/DBContext.txt`,
    substitutions: new Map([
      ["DB_SETS", entity.map((e) => GenDbSet(e)).join("\n")],
      ...ContextSubstitutions(context),
    ]),
  });

  WriteCodeToFile(`Data/${context.dbContextName}.cs`, code, context);
};
