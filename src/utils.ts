import { ColumnTypes, AppContext } from "./types";
import * as fs from "fs";

export const CSharpTypesMap: Map<ColumnTypes, string> = new Map([
  ["string", "string"],
  ["number", "int"],
  ["datetime", "DateTime"],
  ["boolean", "bool"],
  ["password", "string"],
]);

export const TypeScriptTypesMap: Map<ColumnTypes, string> = new Map([
  ["string", "string"],
  ["number", "number"],
  ["datetime", "string"],
  ["boolean", "boolean"],
  ["password", "string"],
]);

export const WriteCodeToFile = (
  path: string,
  content: string,
  context: AppContext
) => {
  fs.writeFile(
    `${context.basePath}/${context.projectName}/${path}`,
    content,
    (error) => {
      if (error) {
        console.error(`Error generating ${path}`, error);
      } else {
        console.log(`Created ${path}`);
      }
    }
  );
};
