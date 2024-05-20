import { Entity, AppContext } from "../../../types";
import { WriteCodeToFile } from "../../../utils";
import { OdataModelCode } from "./OdataModelCode";

export const OdataModelBuilderGenerator = (
  entities: Entity[],
  context: AppContext
) => {
  const code = OdataModelCode(entities, context);
  WriteCodeToFile(`Data/OdataModel.cs`, code, context);
};
