import { execFileSync } from "child_process";

import { workspace } from "vscode";

import { TaskCli } from "./task-cli";

export function getTaskCli(): TaskCli {
  function getTaskwarriorExecutable(): string {
    const executablePathSetting: string | undefined = workspace
      .getConfiguration("taskwarrior")
      .get("executablePath");

    if (executablePathSetting?.length) {
      return executablePathSetting;
    } else {
      return "task";
    }
  }

  return {
    run: (argv: string[]) => {
      return execFileSync(getTaskwarriorExecutable(), argv);
    },
  };
}
