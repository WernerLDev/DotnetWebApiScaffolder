import { AppContext, Entity } from "../../../types";

export const RepositoryCode = (entity: Entity, context: AppContext) => {
  return `
using Microsoft.AspNetCore.OData.Deltas;
using ${context.projectName}.Data;
using ${context.projectName}.Models;
using ${context.projectName}.Models.Dtos;
  
namespace ${context.projectName};
  
public class ${entity.name}Repository
{
  
  private ${context.dbContextName} _dbContext;
  
  public ${entity.name}Repository(${context.dbContextName} dbContext)
  {
    _dbContext = dbContext;
  }

  public IQueryable All() {
    return _dbContext.${entity.plural};
  }

  public async Task<${entity.name}?> FindById(int key)
  {
    return await _dbContext.${entity.plural}.FindAsync(key);
  }
  
  public async Task<${entity.name}> Create(${entity.name}Dto dto)
  {
    ${entity.name} entity = new ${entity.name}()
    {
${entity.columns
  .map((column) => `    ${column.name} = dto.${column.name},`)
  .join("\n")}
    };
  
    _dbContext.${entity.plural}.Add(entity);
    await _dbContext.SaveChangesAsync();
  
    return entity;
  }
  
  public async Task<${entity.name}> Patch(Delta<${entity.name}> delta, ${
    entity.name
  } entity)
  {
    delta.Patch(entity);
    entity.UpdatedAt = DateTime.Now;
    await _dbContext.SaveChangesAsync();
    return entity;
  }
  
  public async Task Delete(int id)
  {
    var p = _dbContext.${entity.plural}.SingleOrDefault(x => x.Id == id);
    if (p == null)
    {
      throw new Exception($"No ${entity.name} found with ID {id}");
    }
  
    _dbContext.${entity.plural}.Remove(p);
    await _dbContext.SaveChangesAsync();
  }
  
}
`;
};
