import { Entity, AppContext } from "../../../types";
import {
  EntitySubstitutions,
  GenerateCode,
  ContextSubstitutions,
  WriteCodeToFile,
} from "../../../utils";
import { GenModelProperty } from "../DataModels/DataModelCode";

export const DtosGenerator = async (
  entities: Entity[],
  context: AppContext
) => {
  entities.forEach(async (entity) => {
    const fields = entity.columns.map((c) => GenModelProperty(c)).join("\n");
    const output = await GenerateCode({
      template: `${__dirname}/EntityDto.txt`,
      substitutions: new Map([
        ["MODEL_FIELDS", fields],
        ...EntitySubstitutions(entity),
        ...ContextSubstitutions(context),
      ]),
    });

    WriteCodeToFile(`Models/Dtos/${entity.name}Dto.cs`, output, context);
  });
};
