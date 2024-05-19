import { Entity, AppContext } from "../../../types";
import { WriteCodeToFile } from "../../../utils";
import { DataModelCode } from "./DataModelCode";

export const ModelsGenerator = async (
  entities: Entity[],
  context: AppContext
) => {
  entities.forEach(async (entity) => {
    const generated = DataModelCode(entity, entities, context);
    WriteCodeToFile(`Models/Entities/${entity.name}.cs`, generated, context);
  });
};
