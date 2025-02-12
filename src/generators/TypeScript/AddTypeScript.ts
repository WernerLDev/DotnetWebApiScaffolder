import { TsScaffolder } from "../../scaffold";
import { TypeScriptTypes } from "./TypeDefenitions/TypesGenerator";

export const AddTypeScript = (scaffolder: TsScaffolder, location: string) => {
  scaffolder.addGenerator(TypeScriptTypes(location));
};
