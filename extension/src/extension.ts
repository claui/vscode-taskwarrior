import {
  ExtensionContext,
  LanguageStatusItem,
  commands,
  languages,
  window,
  workspace,
} from "vscode";

import { getTaskCli } from "./cli-adapter";
import CliFailedError from "./errors/cli-failed";
import { getTaskwarriorVersion, TaskCli } from "./task-cli";
import { getCurrentTimestamp } from "./time";

const outputChannel = window.createOutputChannel("Taskwarrior");

const log = {
  error: function (...args: any[]) {
    this.log("ERROR", ...args);
  },
  info: function (...args: any[]) {
    this.log("INFO", ...args);
  },
  log: function (level: string, ...args: any[]) {
    const timestamp = getCurrentTimestamp();
    outputChannel.appendLine(`${timestamp} [${level}] ${args.join(" ")}`);
  },
};

const statusItem: LanguageStatusItem = languages.createLanguageStatusItem(
  "taskwarrior.status.item.version",
  { language: "taskwarrior" }
);

const refreshStatus = async (taskCli: TaskCli) => {
  try {
    statusItem.detail = "Querying Taskwarrior version";
    log.info(statusItem.detail);
    statusItem.busy = true;

    const versionNumber = await getTaskwarriorVersion(taskCli);
    statusItem.text = `Taskwarrior v${versionNumber}`;
    log.info(statusItem.text);
    statusItem.detail = `Last updated: ${getCurrentTimestamp()}`;
  } catch (error) {
    statusItem.text = "$(error) Taskwarrior";
    log.error(error?.message ?? error);
    if (error instanceof CliFailedError) {
      log.error(`> ${error?.cause.message}`);
    }
  } finally {
    statusItem.busy = false;
  }
};

export function activate(context: ExtensionContext) {
  commands.registerCommand("taskwarrior.action.refresh", () => {
    getTaskCli(context).then(refreshStatus);
  });
  commands.registerCommand("taskwarrior.action.showLog", () => {
    outputChannel.show();
  });
  workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("taskwarrior")) {
      getTaskCli(context).then(refreshStatus);
    }
  });
  statusItem.command = {
    command: "taskwarrior.action.showLog",
    title: "Show extension log",
  };

  getTaskCli(context).then(refreshStatus);

  return {
    getTaskwarriorVersion: async () => {
      return getTaskwarriorVersion(await getTaskCli(context));
    },
  };
}

export function deactivate() {}
