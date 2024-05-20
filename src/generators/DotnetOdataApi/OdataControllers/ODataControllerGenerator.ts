import { Entity, AppContext } from "../../../types";
import { WriteCodeToFile } from "../../../utils";
import { OdataControllerCode } from "./OdataControllerCode";

export const OdataGenerator = (entities: Entity[], context: AppContext) => {
  entities.forEach(async (entity) => {
    const code = OdataControllerCode(entity, context);

    WriteCodeToFile(
      `Controllers/Api/${entity.name}Controller.cs`,
      code,
      context
    );
  });
};
