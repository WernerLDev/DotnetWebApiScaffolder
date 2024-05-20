import { Entity, AppContext } from "../../../types";
import { WriteCodeToFile } from "../../../utils";
import { ServiceExtensionCode } from "./ServiceExtensionCode";

export const ServiceExtensionGenerator = async (
  entities: Entity[],
  context: AppContext
) => {
  const code = ServiceExtensionCode(entities, context);
  WriteCodeToFile(
    `Extensions/${context.projectName}Extension.cs`,
    code,
    context
  );
};
