import { TsScaffolder } from "../../scaffold";
import { TypeScriptTypesGenerator } from "./TSTypesGenerator";

export const AddTypeScript = (scaffolder: TsScaffolder) => {
  scaffolder.addGenerator(TypeScriptTypesGenerator);
};
