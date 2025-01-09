import pluralize from "pluralize";
import {
  CodeGenerator,
  Entity,
  AppContext,
  Scaffolder,
  EntityWithoutPlural,
} from "./types";

export class TsScaffolder implements Scaffolder {
  private generators: CodeGenerator[] = [];
  private entities: Entity[] = [];

  constructor(private context: AppContext) {}

  public addGenerator(generator: CodeGenerator) {
    this.generators.push(generator);
    return this;
  }

  public addEntity(entity: EntityWithoutPlural) {
    this.entities.push({
      ...entity,
      columns: [{ name: "Id", type: "number" }, ...entity.columns],
      plural: pluralize(entity.name),
      kind: "Set",
    });
    return this;
  }

  public generate() {
    this.createManyToManyEntities();
    this.processRelations();
    this.generators.forEach((generator) => {
      generator(this.entities, this.context);
    });
  }

  private createManyToManyEntities() {
    this.entities.forEach((parent) => {
      parent.relations?.forEach((relation) => {
        const target = this.entities.find((x) => x.name === relation.target);
        if (target == null)
          throw Error(`No target found with name ${relation.target}`);
        if (relation.kind === "manyToMany") {
          const entityName = `${parent.name}${target.name}`;
          this.entities.push({
            name: entityName,
            plural: pluralize(entityName),
            columns: [],
            relations: [],
            kind: "Relation",
          });

          parent.relations = [
            ...(parent.relations ?? []),
            { kind: "oneToMany", target: entityName },
          ];

          target.relations = [
            ...(target.relations ?? []),
            { kind: "oneToMany", target: entityName },
          ];
        }
      });
    });
  }

  private processRelations() {
    this.entities = this.entities.map((entity) => {
      entity.relations?.forEach((relation) => {
        if (relation.kind === "oneToOne") {
          entity.columns.push({ name: `${relation.target}Id`, type: "number" });
        } else if (relation.kind === "oneToMany") {
          const relationIndex = this.entities.findIndex(
            (x) => x.name === relation.target
          );
          this.entities[relationIndex].columns.push({
            name: `${entity.name}Id`,
            type: "number",
          });
        }
      });
      return entity;
    });

    this.entities;
  }
}
