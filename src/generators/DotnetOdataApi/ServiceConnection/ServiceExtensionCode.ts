import { AppContext, Entity } from "../../../types";

export const ServiceExtensionCode = (
  entities: Entity[],
  context: AppContext
) => {
  return `using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using ${context.projectName}.Data;
using ${context.projectName}.WebApi;

namespace ${context.projectName};

public static class Add${context.projectName}Extension
{
  public static IServiceCollection Add${context.projectName}(
        this IServiceCollection services, Action<DbContextOptionsBuilder> optionsAction)
  {
    services.AddControllers().AddOData(
    options => options.Select().Filter().OrderBy().Expand().Count().SetMaxTop(100).AddRouteComponents(
        "odata",
        OdataModel.BuildOdataModel().GetEdmModel()));

${entities
  .map((entity) => {
    return `    services.AddScoped<${entity.name}Repository>();`;
  })
  .join("\n")}

    services.AddDbContext<${context.dbContextName}>(optionsAction);

    return services;
  }
}
`;
};
