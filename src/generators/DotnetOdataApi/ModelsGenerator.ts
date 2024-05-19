import pluralize from "pluralize";
import { Column, Entity, AppContext } from "../../types";
import {
  CSharpTypesMap,
  EntitySubstitutions,
  GenerateCode,
  ContextSubstitutions,
  WriteCodeToFile,
} from "../../utils";

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

export const ModelsGenerator = async (
  entities: Entity[],
  context: AppContext
) => {
  entities.forEach(async (entity) => {
    const fields = entity.columns.map((c) => GenModelProperty(c)).join("\n");
    const output = await GenerateCode({
      template: `${__dirname}/templates/DataModel.txt`,
      substitutions: new Map([
        ["MODEL_FIELDS", fields.concat(`\n${GenRelations(entity, entities)}`)],
        ...EntitySubstitutions(entity),
        ...ContextSubstitutions(context),
      ]),
    });

    WriteCodeToFile(`Models/Entities/${entity.name}.cs`, output, context);
  });
};
