import { Entity, AppContext } from "../../types";
import {
  GenerateCode,
  ContextSubstitutions,
  WriteCodeToFile,
} from "../../utils";

export const ServiceExtensionGenerator = async (
  entities: Entity[],
  context: AppContext
) => {
  const Repositories = entities
    .map((entity) => {
      return `    services.AddScoped<${entity.name}Repository>();`;
    })
    .join("\n");

  const code = await GenerateCode({
    template: `${__dirname}/templates/ServiceExtension.txt`,
    substitutions: new Map([
      ["REPOSITORIES", Repositories],
      ...ContextSubstitutions(context),
    ]),
  });

  WriteCodeToFile(
    `Extensions/${context.projectName}Extension.cs`,
    code,
    context
  );
};
