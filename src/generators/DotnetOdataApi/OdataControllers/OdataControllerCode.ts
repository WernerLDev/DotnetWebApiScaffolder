import { AppContext, Entity } from "../../../types";

export const OdataControllerCode = (entity: Entity, context: AppContext) => {
  return `
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using ${context.projectName}.Models;
using ${context.projectName}.Models.Dtos;

namespace ${context.projectName}.Controllers.Api;

public class ${entity.plural}Controller(${
    entity.name
  }Repository repo) : ODataController
{
 
  [EnableQuery]
  public ActionResult<IEnumerable<${entity.name}>> Get()
  {
    return Ok(repo.All());
  }

  ${
    entity.kind === "Set"
      ? OdataSetMethods(entity)
      : OdataRelationMethods(entity)
  }

}
`;
};

const OdataSetMethods = (entity: Entity) => `
  [EnableQuery]
  public SingleResult<${entity.name}> Get([FromODataUri] int key)
  {
    return SingleResult.Create(repo.FindById(key));
  }

  [HttpPost]
  public async Task<ActionResult<${entity.name}>> Post([FromBody] ${entity.name}Dto entity)
  {
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }
    return Created(await repo.Create(entity));
  }

  [HttpPatch]
  public async Task<ActionResult<${entity.name}>> Patch([FromODataUri] int key, [FromBody] Delta<${entity.name}> entity)
  {
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }
    var dbEntity = repo.FindById(key).FirstOrDefault();
    if (dbEntity == null)
    {
      return NotFound();
    }

    return Ok(await repo.Update(entity.Patch(dbEntity)));
  }

  [HttpDelete]
  public async Task<IActionResult> Delete([FromODataUri] int key)
  {
    var dbEntity = repo.FindById(key).FirstOrDefault();
    if (dbEntity != null)
    {
      await repo.Delete(key);
    }

    return NoContent();
  }
`;

const OdataRelationMethods = (entity: Entity) => `
  [HttpPost("odata/${entity.plural}/Link")]
  public async Task<ActionResult> Link([FromBody] ${entity.name}Dto dto)
  {
    await repo.Link(dto.${entity.columns[0].name}, dto.${entity.columns[1].name});
    return NoContent();
  }

  [HttpPost("odata/${entity.plural}/Unlink")]
  public async Task<ActionResult> Unlink([FromBody] ${entity.name}Dto dto)
  {
    await repo.Unlink(dto.${entity.columns[0].name}, dto.${entity.columns[1].name});
    return NoContent();
  }
`;
