import { TsScaffolder } from "../../scaffold";
import { TypeScriptTypes } from "./TypeDefenitions/TypesGenerator";

export const AddTypeScript = (scaffolder: TsScaffolder) => {
  scaffolder.addGenerator(TypeScriptTypes);
};
