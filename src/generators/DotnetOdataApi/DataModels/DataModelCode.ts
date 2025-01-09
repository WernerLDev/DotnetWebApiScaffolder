import pluralize from "pluralize";
import { AppContext, Column, Entity } from "../../../types";
import { CSharpTypesMap } from "../../../utils";

/*
 * Class property for a single entity column
 */
export const GenModelProperty = (column: Column) => {
  if (column.type === "string") {
    return `  public string ${column.name} { get; set; } = String.Empty;`;
  }
  return `  public ${CSharpTypesMap.get(column.type)} ${
    column.name
  } { get; set; }`;
};

/*
 *  Generate a EntityId and reference for defined relations
 */
const GenRelations = (entity: Entity) => {
  let relations: string[] = [];

  entity.relations?.forEach((relation) => {
    if (relation.kind === "oneToOne") {
      relations.push(
        `  public ${relation.target}? ${relation.target} { get; set; }`
      );
    } else if (
      relation.kind === "oneToMany" ||
      relation.kind === "manyToMany"
    ) {
      const plural = pluralize(relation.target);
      relations.push(
        `  public ICollection<${relation.target}> ${plural} { get; set; } = [];`
      );
    }
  });

  return relations;
};

/*
 *  Generates a reference to entities that defined a relation to this entity
 */
const GenReverseRelations = (entity: Entity, entities: Entity[]) => {
  const relations: string[] = [];

  entities.forEach((otherEntity) => {
    if (otherEntity.name !== entity.name) {
      otherEntity.relations?.forEach((relation) => {
        if (relation.target === entity.name) {
          switch (relation.kind) {
            case "oneToOne":
            case "oneToMany":
              relations.push(
                `  public ${otherEntity.name}? ${otherEntity.name} {get; set; }`
              );
              break;
            case "manyToMany":
              const plural = pluralize(otherEntity.name);
              relations.push(
                `  public ICollection<${otherEntity.name}> ${plural} { get; set; } = [];`
              );
              break;
          }
        }
      });
    }
  });

  return relations;
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
${entity.columns.map((e) => GenModelProperty(e)).join("\n")}
${GenRelations(entity).join("\n")}
${GenReverseRelations(entity, allEntities).join("\n")}

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

`;
};
