import { AppContext, Entity } from "../../../types";

export const OdataModelCode = (entities: Entity[], context: AppContext) => {
  return `
using Microsoft.OData.ModelBuilder;
using ${context.projectName}.Models;

namespace ${context.projectName}.Data;

public class OdataModel
{

  public static ODataConventionModelBuilder BuildOdataModel()
  {
    var modelBuilder = new ODataConventionModelBuilder();

${entities
  .map(
    (entity) => `    modelBuilder.EntitySet<${entity.name}>("${entity.name}");`
  )
  .join("\n")}

    return modelBuilder;
  }

}

  `;
};
