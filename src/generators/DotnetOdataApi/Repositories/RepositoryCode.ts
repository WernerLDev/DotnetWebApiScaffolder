import { AppContext, Entity } from "../../../types";

export const RepositoryCode = (entity: Entity, context: AppContext) => {
  return `
using ${context.projectName}.Data;
using ${context.projectName}.Models;
using ${context.projectName}.Models.Dtos;
  
namespace ${context.projectName};
  
public class ${entity.name}Repository(${context.dbContextName} dbContext)
{
  public IQueryable All() {
    return dbContext.${entity.plural};
  }

  ${
    entity.kind === "Set" ? RepoSetMethods(entity) : RepoRelationMethods(entity)
  }
  
}
`;
};

const RepoSetMethods = (entity: Entity) => `
  public IQueryable<${entity.name}> FindById(int key)
  {
    return dbContext.${entity.plural}.Where(x => x.Id.Equals(key));
  }
  
  public async Task<${entity.name}> Create(${entity.name}Dto dto)
  {
    ${entity.name} entity = new ${entity.name}()
    {
${entity.columns
  .filter((x) => x.name !== "Id")
  .map((column) => `    ${column.name} = dto.${column.name},`)
  .join("\n")}
    };
  
    dbContext.${entity.plural}.Add(entity);
    await dbContext.SaveChangesAsync();
  
    return entity;
  }
  
  public async Task<${entity.name}> Update(${entity.name} entity)
  {
    entity.UpdatedAt = DateTime.Now;
    await dbContext.SaveChangesAsync();
    return entity;
  }
  
  public async Task Delete(int id)
  {
    var p = dbContext.${entity.plural}.SingleOrDefault(x => x.Id == id);
    if (p == null)
    {
      throw new Exception($"No ${entity.name} found with ID {id}");
    }
  
    dbContext.${entity.plural}.Remove(p);
    await dbContext.SaveChangesAsync();
  }
`;

const RepoRelationMethods = (entity: Entity) => `
  public async Task Link(int ${entity.columns[0].name}, int ${entity.columns[1].name})
  {
    dbContext.${entity.plural}.Add(new ${entity.name}()
    {
      ${entity.columns[0].name} = ${entity.columns[0].name},
      ${entity.columns[1].name} = ${entity.columns[1].name}
    });
    await dbContext.SaveChangesAsync();
  }

  public async Task Unlink(int ${entity.columns[0].name}, int ${entity.columns[1].name})
  {
    var link = dbContext.${entity.plural}.SingleOrDefault(x => x.${entity.columns[0].name}.Equals(${entity.columns[0].name}) && x.${entity.columns[1].name}.Equals(${entity.columns[1].name}));
    if (link != null)
    {
      dbContext.${entity.plural}.Remove(link);
      await dbContext.SaveChangesAsync();
    }
  }
`;
