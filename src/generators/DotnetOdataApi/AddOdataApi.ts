import { TsScaffolder } from "../../scaffold";
import { DbContextGenerator } from "./DbContextGenerator";
import { DtosGenerator } from "./DtoGenerator";
import { ModelsGenerator } from "./ModelsGenerator";
import { OdataGenerator } from "./ODataControllerGenerator";
import { OdataModelBuilderGenerator } from "./OdataModelBuilder";
import { RepositoryGenerator } from "./RepositoryGenerator";
import { ServiceExtensionGenerator } from "./ServiceExtensionGenerator";

export const AddOdataApi = (scaffolder: TsScaffolder) => {
  scaffolder
    .addGenerator(OdataGenerator)
    .addGenerator(ModelsGenerator)
    .addGenerator(DbContextGenerator)
    .addGenerator(OdataModelBuilderGenerator)
    .addGenerator(DtosGenerator)
    .addGenerator(RepositoryGenerator)
    .addGenerator(ServiceExtensionGenerator);
};
