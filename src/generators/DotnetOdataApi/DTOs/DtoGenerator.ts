import { Entity, AppContext } from "../../../types";
import { WriteCodeToFile } from "../../../utils";
import { DtoCode } from "./DtoCode";

export const DtosGenerator = async (
  entities: Entity[],
  context: AppContext
) => {
  entities.forEach(async (entity) => {
    const code = DtoCode(entity, context);
    WriteCodeToFile(`Models/Dtos/${entity.name}Dto.cs`, code, context);
  });
};
