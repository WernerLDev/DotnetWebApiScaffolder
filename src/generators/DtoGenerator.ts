import { Column, Entity, ProjectMeta } from "../types";
import {
  CSharpTypesMap,
  EntitySubstitutions,
  GenerateCode,
  MetaSubstitutions,
  WriteCodeToFile,
} from "../utils";
import { GenModelProperty } from "./ModelsGenerator";

export const DtosGenerator = async (entities: Entity[], meta: ProjectMeta) => {
  entities.forEach(async (entity) => {
    const fields = entity.columns.map((c) => GenModelProperty(c)).join("\n");
    const output = await GenerateCode({
      template: `${__dirname}/templates/EntityDto.txt`,
      substitutions: new Map([
        ["MODEL_FIELDS", fields],
        ...EntitySubstitutions(entity),
        ...MetaSubstitutions(meta),
      ]),
    });

    WriteCodeToFile(`Models/Dtos/${entity.name}Dto.cs`, output, meta);
  });
};
