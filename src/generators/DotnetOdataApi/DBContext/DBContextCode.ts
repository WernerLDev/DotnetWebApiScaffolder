import { AppContext, Entity } from "../../../types";

export const DBContextCode = (entities: Entity[], context: AppContext) => {
  return `
using Microsoft.EntityFrameworkCore;
using ${context.projectName}.Models;

namespace ${context.projectName}.Data;

public class ${context.dbContextName} : DbContext
{
  public ${context.dbContextName}()
  {
  }

  public ${context.dbContextName}(DbContextOptions options) : base(options)
  {
  }

  protected override void OnConfiguring(DbContextOptionsBuilder options)
  {
    if (!options.IsConfigured)
    {
      options.UseSqlite($"Data Source=data.db");
    }
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    ${generateManyToManyRelation(entities)}
  }

${entities
  .map(
    (entity) =>
      `  public required DbSet<${entity.name}> ${entity.plural} { get; set; }`
  )
  .join("\n")}
}
`;
};

const generateManyToManyRelation = (entities: Entity[]) => {
  const relations: String[] = [];

  entities.forEach((entity) => {
    entity.relations
      ?.filter((x) => x.kind === "manyToMany")
      .forEach((relation) => {
        const targetEntity = entities.find((x) => x.name === relation.target);
        if (targetEntity == null)
          throw new Error(
            `No target entity found with name ${relation.target}`
          );

        relations.push(`
    modelBuilder.Entity<${entity.name}>()
      .HasMany(e => e.${targetEntity.plural})
      .WithMany(e => e.${entity.plural})
      .UsingEntity<${entity.name}${targetEntity.name}>();
          `);
      });
  });

  return relations.join("\n");
};
