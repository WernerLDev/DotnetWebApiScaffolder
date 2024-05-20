import { CodeGenerator, Entity, AppContext, Scaffolder } from "./types";

export class TsScaffolder implements Scaffolder {
  private generators: CodeGenerator[] = [];
  private entities: Entity[] = [];

  constructor(private context: AppContext) {}

  public addGenerator(generator: CodeGenerator) {
    this.generators.push(generator);
    return this;
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity);
    return this;
  }
  public generate() {
    this.processRelations();
    this.generators.forEach((generator) => {
      generator(this.entities, this.context);
    });
  }

  private processRelations() {
    this.entities = this.entities.map((entity) => {
      entity.relations?.forEach((relation) => {
        if (relation.has == "one") {
          entity.columns.push({ name: `${relation.target}Id`, type: "number" });
        } else if (relation.has == "many") {
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
