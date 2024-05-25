import { AppContext, Entity } from "../../../types";

export const RepositoryCode = (entity: Entity, context: AppContext) => {
  return `
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
  
  public async Task<${entity.name}> Update(${entity.name}Dto dto, int id)
  {
    var dbEntity = _dbContext.${entity.plural}.SingleOrDefault(x => x.Id == id);
    if (dbEntity == null)
    {
      throw new Exception($"No ${entity.name} found with ID {id}");
    }
      
    dbEntity.UpdatedAt = DateTime.Now;
${entity.columns
  .map((column) => `    dbEntity.${column.name} = dto.${column.name};`)
  .join("\n")}
  
    _dbContext.${entity.plural}.Update(dbEntity);
    await _dbContext.SaveChangesAsync();
  
    return dbEntity;
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
