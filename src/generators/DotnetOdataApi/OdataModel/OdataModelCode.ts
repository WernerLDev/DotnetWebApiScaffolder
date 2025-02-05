import { AppContext, Entity } from "../../../types";

export const OdataModelCode = (entities: Entity[], context: AppContext) => {
  return `
using Microsoft.OData.ModelBuilder;
using ${context.projectName}.Models;

namespace ${context.projectName}.WebApi;

public class OdataModel
{

  public static ODataConventionModelBuilder BuildOdataModel()
  {
    var modelBuilder = new ODataConventionModelBuilder();

${entities
  .filter((x) => x.kind === "Relation")
  .map(
    (entity) =>
      `    modelBuilder.EntityType<${entity.name}>()
      .HasKey(c => new { c.${entity.columns[0].name}, c.${entity.columns[1].name} });`
  )}

${entities
  .filter((x) => x.kind === "Set")
  .map(
    (entity) =>
      `    modelBuilder.EntitySet<${entity.name}>("${entity.plural}");`
  )
  .join("\n")}

    return modelBuilder;
  }

}
`;
};
