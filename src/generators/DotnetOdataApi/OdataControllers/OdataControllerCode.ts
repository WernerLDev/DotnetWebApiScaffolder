import { AppContext, Entity } from "../../../types";

export const OdataControllerCode = (entity: Entity, context: AppContext) => {
  return `
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using ${context.projectName}.Data;
using ${context.projectName}.Models;
using ${context.projectName}.Models.Dtos;

namespace ${context.projectName}.Controllers.Api;

[Route("/odata/${entity.name}")]
public class ${entity.name}Controller : ODataController
{

  private readonly ${context.dbContextName} _dbContext;
  private readonly ${entity.name}Repository _repo;

  public ${entity.name}Controller(${context.dbContextName} dbContext, ${entity.name}Repository repo)
  {
    _dbContext = dbContext;
    _repo = repo;
  }

  [EnableQuery]
  public ActionResult<IEnumerable<${entity.name}>> Get()
  {
    return Ok(_dbContext.${entity.plural});
  }

  public ActionResult<${entity.name}> Get${entity.name}([FromODataUri] int key)
  {
    return _dbContext.${entity.plural}.Single(x => x.Id == key);
  }

  [HttpPost]
  public async Task<ActionResult<${entity.name}>> Create([FromBody] ${entity.name}Dto entity)
  {
    return Ok(await _repo.Create(entity));
  }

  [HttpPut("{id}")]
  public async Task<ActionResult<${entity.name}>> Update([FromBody] ${entity.name}Dto entity, [FromRoute] int id)
  {
    try {
      return Ok(await _repo.Update(entity, id));
    } catch(Exception e) {
      return BadRequest(e.Message);
    }
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete([FromRoute] int id)
  {
    try {
      await _repo.Delete(id);
      return Ok();
    } catch(Exception e) {
      return BadRequest(e.Message);
    }
  }

}

  `;
};
