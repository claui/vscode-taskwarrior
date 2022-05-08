import { execFileSync } from "child_process";

import { ExtensionContext, workspace } from "vscode";

import { TaskCli } from "./task-cli";

export async function getTaskCli(context: ExtensionContext): Promise<TaskCli> {
  const getTaskwarriorExecutable = async (): Promise<string> => {
    const executablePathSetting: string | undefined = workspace
      .getConfiguration("taskwarrior")
      .get("executablePath");

    if ((executablePathSetting ?? "") === "") {
      return "task";
    }
    return executablePathSetting;
  };

  return {
    run: async (argv: string[]) => {
      return execFileSync(await getTaskwarriorExecutable(), argv);
    },
  };
}
