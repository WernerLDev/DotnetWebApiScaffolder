import { Column, Entity, ProjectMeta } from "../types";
import {
  EntitySubstitutions,
  GenerateCode,
  MetaSubstitutions,
  WriteCodeToFile,
} from "../utils";

const GenCreate = (column: Column) => {
  return `    ${column.name} = dto.${column.name},`;
};

const GenUpdate = (column: Column) => {
  return `    dbEntity.${column.name} = dto.${column.name};`;
};

export const RepositoryGenerator = async (
  entities: Entity[],
  meta: ProjectMeta
) => {
  entities.forEach(async (entity) => {
    const output = await GenerateCode({
      template: `${__dirname}/templates/Repository.txt`,
      substitutions: new Map([
        ["FIELDS", entity.columns.map((c) => GenCreate(c)).join("\n")],
        ["UPDATE_FIELDS", entity.columns.map((c) => GenUpdate(c)).join("\n")],
        ...EntitySubstitutions(entity),
        ...MetaSubstitutions(meta),
      ]),
    });

    WriteCodeToFile(
      `Data/Repositories/${entity.name}Repository.cs`,
      output,
      meta
    );
  });
};
