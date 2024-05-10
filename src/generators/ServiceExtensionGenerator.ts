import { Entity, ProjectMeta } from "../types";
import { GenerateCode, MetaSubstitutions, WriteCodeToFile } from "../utils";

export const ServiceExtensionGenerator = async (
  entities: Entity[],
  meta: ProjectMeta
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
      ...MetaSubstitutions(meta),
    ]),
  });

  WriteCodeToFile(`Extensions/${meta.projectName}Extension.cs`, code, meta);
};
