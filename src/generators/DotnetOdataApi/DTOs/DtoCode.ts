import { AppContext, Entity } from "../../../types";
import { GenModelProperty } from "../DataModels/DataModelCode";

export const DtoCode = (entity: Entity, context: AppContext) => {
  return `
namespace ${context.projectName}.Models.Dtos;

public class ${entity.name}Dto
{
${entity.columns.map((c) => GenModelProperty(c)).join("\n")}
}
  `;
};
