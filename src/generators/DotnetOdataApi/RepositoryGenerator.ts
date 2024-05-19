import { Column, Entity, AppContext } from "../../types";
import {
  EntitySubstitutions,
  GenerateCode,
  ContextSubstitutions,
  WriteCodeToFile,
} from "../../utils";

const GenCreate = (column: Column) => {
  return `    ${column.name} = dto.${column.name},`;
};

const GenUpdate = (column: Column) => {
  return `    dbEntity.${column.name} = dto.${column.name};`;
};

export const RepositoryGenerator = async (
  entities: Entity[],
  context: AppContext
) => {
  entities.forEach(async (entity) => {
    const output = await GenerateCode({
      template: `${__dirname}/templates/Repository.txt`,
      substitutions: new Map([
        ["FIELDS", entity.columns.map((c) => GenCreate(c)).join("\n")],
        ["UPDATE_FIELDS", entity.columns.map((c) => GenUpdate(c)).join("\n")],
        ...EntitySubstitutions(entity),
        ...ContextSubstitutions(context),
      ]),
    });

    WriteCodeToFile(
      `Data/Repositories/${entity.name}Repository.cs`,
      output,
      context
    );
  });
};
