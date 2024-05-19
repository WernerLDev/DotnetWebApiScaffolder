import { TsScaffolder } from "../../scaffold";
import { DbContextGenerator } from "./DBContext/DbContextGenerator";
import { DtosGenerator } from "./DTOs/DtoGenerator";
import { ModelsGenerator } from "./DataModels/ModelsGenerator";
import { OdataGenerator } from "./OdataControllers/ODataControllerGenerator";
import { OdataModelBuilderGenerator } from "./OdataModel/OdataModelBuilder";
import { RepositoryGenerator } from "./Repositories/RepositoryGenerator";
import { ServiceExtensionGenerator } from "./ServiceConnection/ServiceExtensionGenerator";

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
