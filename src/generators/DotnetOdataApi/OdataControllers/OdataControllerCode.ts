import { AppContext, Entity } from "../../../types";

export const OdataControllerCode = (entity: Entity, context: AppContext) => {
  return `
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using ${context.projectName}.Data;
using ${context.projectName}.Models;
using ${context.projectName}.Models.Dtos;

namespace ${context.projectName}.Controllers.Api;

public class ${entity.plural}Controller : ODataController
{

  private readonly ${context.dbContextName} _dbContext;
  private readonly ${entity.name}Repository _repo;

  public ${entity.plural}Controller(${context.dbContextName} dbContext, ${entity.name}Repository repo)
  {
    _dbContext = dbContext;
    _repo = repo;
  }

  [EnableQuery]
  public ActionResult<IEnumerable<${entity.name}>> Get()
  {
    return Ok(_dbContext.${entity.plural});
  }

  [EnableQuery]
  public ActionResult<${entity.name}> Get([FromODataUri] int key)
  {
    var dbEntity = _dbContext.${entity.plural}.SingleOrDefault(x => x.Id == key);

    if(dbEntity == null) 
    {
      return NotFound();
    }

    return Ok(dbEntity);
  }

  [HttpPost]
  public async Task<ActionResult<${entity.name}>> Post([FromBody] ${entity.name}Dto entity)
  {
    return Created(await _repo.Create(entity));
  }

  [HttpPatch]
  public async Task<ActionResult<${entity.name}>> Patch([FromODataUri] int key, [FromBody] Delta<${entity.name}> entity)
  {
    var dbEntity = await _repo.FindById(key);
    if (dbEntity == null)
    {
      return NotFound();
    }

    return Ok(await _repo.Patch(entity, dbEntity));
  }

  [HttpDelete]
  public async Task<IActionResult> Delete([FromODataUri] int key)
  {
    var dbEntity = await _repo.FindById(key);
    if (dbEntity != null)
    {
      await _repo.Delete(key);
      
    }

    return NoContent();
  }

}
`;
};
