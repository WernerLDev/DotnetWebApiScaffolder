import { Entity, AppContext } from "../../../types";
import { WriteCodeToFile } from "../../../utils";
import { OdataModelCode } from "./OdataModelCode";

export const OdataModelBuilderGenerator = async (
  entities: Entity[],
  context: AppContext
) => {
  const code = OdataModelCode(entities, context);
  await WriteCodeToFile(`WebApi/OdataModel.cs`, code, context);
};
