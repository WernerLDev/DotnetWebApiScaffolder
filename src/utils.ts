import pluralize from "pluralize";
import { Column, ColumnTypes, Entity, ProjectMeta } from "./types";
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

export const EntitySubstitutions = (entity: Entity): [string, string][] => {
  return [
    ["ENTITY_NAME", entity.name],
    ["ENTITY_NAME_PLURAL", pluralize(entity.name)],
  ];
};

export const MetaSubstitutions = (meta: ProjectMeta): [string, string][] => {
  return [
    ["PROJECTNAME", meta.projectName],
    ["DBCONTEXT_NAME", meta.dbContextName],
  ];
};

export const GenerateCode = (params: {
  template: string;
  substitutions: Map<string, string>;
}) => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(params.template, (error, data) => {
      if (error) {
        reject(`Failed to read template ${params.template}`);
      }

      let code = data.toString();
      params.substitutions.forEach((value, key) => {
        code = code.replaceAll(`##${key}##`, value);
      });

      resolve(code);
    });
  });
};

export const WriteCodeToFile = (
  path: string,
  content: string,
  metaData: ProjectMeta
) => {
  fs.writeFile(
    `${metaData.basePath}/${metaData.projectName}/${path}`,
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
