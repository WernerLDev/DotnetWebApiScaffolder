import pluralize from "pluralize";
import { AppContext, Entity } from "../../../types";

export const DBContextCode = (entities: Entity[], context: AppContext) => {
  return `
using Microsoft.EntityFrameworkCore;
using ${context.projectName}.Models;

namespace ${context.projectName}.Data;

public class ${context.dbContextName} : DbContext
{
  public ${context.dbContextName} (DbContextOptions <${
    context.dbContextName
  }> options)
          : base(options)
    { }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
  }

${entities
  .map(
    (entity) =>
      `  public DbSet<${entity.name}> ${pluralize(entity.name)} { get; set; }`
  )
  .join("\n")}
}

  `;
};
