import pluralize from "pluralize";
import { Entity, AppContext } from "../../../types";
import { WriteCodeToFile } from "../../../utils";
import { DBContextCode } from "./DBContextCode";

export const DbContextGenerator = async (
  entities: Entity[],
  context: AppContext
) => {
  const code = DBContextCode(entities, context);
  WriteCodeToFile(`Data/${context.dbContextName}.cs`, code, context);
};
