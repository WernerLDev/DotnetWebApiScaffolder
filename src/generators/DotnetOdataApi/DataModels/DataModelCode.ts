import pluralize from "pluralize";
import { AppContext, Column, Entity } from "../../../types";
import { CSharpTypesMap } from "../../../utils";

export const GenModelProperty = (column: Column) => {
  if (column.type === "string") {
    return `  public string ${column.name} { get; set; } = "";`;
  }
  return `  public ${CSharpTypesMap.get(column.type)} ${
    column.name
  } { get; set; }`;
};

const GenRelations = (entity: Entity, entities: Entity[]) => {
  let relations: string[] = [];

  entity.relations?.forEach((relation) => {
    if (relation.has === "one") {
      relations.push(
        `  public ${relation.target}? ${relation.target} { get; set; }`
      );
    } else if (relation.has === "many") {
      const plural = pluralize(relation.target);
      relations.push(
        `  public ICollection<${relation.target}> ${plural} { get; set; } = new List<${relation.target}>();`
      );
    }
  });

  entities.forEach((otherEntity) => {
    if (otherEntity.name !== entity.name) {
      otherEntity.relations?.forEach((relation) => {
        if (relation.target === entity.name) {
          relations.push(
            `  public ${otherEntity.name}? ${otherEntity.name} {get; set; }`
          );
        }
      });
    }
  });

  return relations.join("\n");
};

export const DataModelCode = (
  entity: Entity,
  allEntities: Entity[],
  context: AppContext
) => {
  return `
using System.ComponentModel.DataAnnotations.Schema;
  
namespace ${context.projectName}.Models;

public class ${entity.name}
{
  public int Id { get; set; }
  
${entity.columns.map((e) => GenModelProperty(e)).join("\n")}
${GenRelations(entity, allEntities)}

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

`;
};
