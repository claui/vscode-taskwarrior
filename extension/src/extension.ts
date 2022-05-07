import {
  ExtensionContext,
  LanguageStatusItem,
  commands,
  languages,
  window,
} from "vscode";

import { sleep } from "./time";

const log = window.createOutputChannel("Taskwarrior");

const dateTimeFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat();

const statusItem: LanguageStatusItem = languages.createLanguageStatusItem(
  "taskwarrior.status.item.version",
  { language: "taskwarrior" }
);

const getTaskWarriorVersion = async () => {
  await sleep(1000);
  return "2.6.2";
};

const refreshStatus = async () => {
  statusItem.detail = "Querying TaskWarrior version";
  log.appendLine(statusItem.detail);
  statusItem.busy = true;

  try {
    const versionNumber = await getTaskWarriorVersion();
    statusItem.text = `Taskwarrior v${versionNumber}`;
    log.appendLine(`Taskwarrior version: ${versionNumber}`);
  } catch (error) {
    statusItem.text = "$(error) Taskwarrior";
  }
  statusItem.detail = `Last updated: ${dateTimeFormat.format(new Date())}`;
  log.appendLine(statusItem.detail);
  statusItem.busy = false;
};

export function activate(context: ExtensionContext) {
  commands.registerCommand("taskwarrior.action.showLog", () => {
    log.show();
  });
  statusItem.command = {
    command: "taskwarrior.action.showLog",
    title: "Show extension log",
  };
  refreshStatus();
  return {
    getTaskWarriorVersion,
  };
}

export function deactivate() {}
