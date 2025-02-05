import { ExecCommand } from "../../../utils";

export const DotnetSolutionGenerator = async () => {
  await ExecCommand("dotnet new solution");
};
