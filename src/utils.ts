import { ColumnTypes, AppContext } from "./types";
import * as fs from "fs";
import { exec } from "child_process";
import { stderr } from "process";
import path from "path";

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

export const WriteCodeToFile = async (
  path: string,
  content: string,
  context: AppContext
) => {
  await EnsureDirExists(path, context);

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

const EnsureDirExists = (pathname: string, context: AppContext) => {
  const base = `${context.basePath}/${context.projectName}`;
  const dir = pathname.split("/").slice(0, -1).join("/");
  return new Promise((resolve, reject) => {
    fs.mkdir(path.resolve(`${base}/${dir}`), { recursive: true }, (error) => {
      if (error !== null && error.code !== "EEXIST") {
        reject(error.message);
      }
      resolve("Directories created");
    });
  });
};

export const ExecCommand = (command: string) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout + stderr);
      }
    });
  });
};
