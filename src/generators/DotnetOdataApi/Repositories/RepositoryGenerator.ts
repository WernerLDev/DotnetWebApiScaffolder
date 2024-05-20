import { Entity, AppContext } from "../../../types";
import { WriteCodeToFile } from "../../../utils";
import { RepositoryCode } from "./RepositoryCode";

export const RepositoryGenerator = async (
  entities: Entity[],
  context: AppContext
) => {
  entities.forEach(async (entity) => {
    const code = RepositoryCode(entity, context);

    WriteCodeToFile(
      `Data/Repositories/${entity.name}Repository.cs`,
      code,
      context
    );
  });
};
