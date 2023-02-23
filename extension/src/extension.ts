import {
  commands,
  DocumentSelector,
  languages,
  LanguageStatusItem,
  workspace,
} from "vscode";

import {
  getDependenciesCodeLensProvider,
  getInlayHintsProvider,
} from "./attributes";

import { getTaskCli } from "./cli-adapter";
import CliFailedError from "./errors/cli-failed";
import log from "./log";

import {
  getDescriptionsByIdProvider,
  getTaskwarriorVersion,
  TaskCli,
} from "./task-cli";

import { getCurrentTimestamp } from "./time";

const languageSelector: DocumentSelector = { language: "taskwarrior" };

const statusItem: LanguageStatusItem = languages.createLanguageStatusItem(
  "taskwarrior.status.item.version",
  languageSelector,
);

function refreshStatus(taskCli: TaskCli) {
  try {
    statusItem.detail = "Querying Taskwarrior version";
    log.info(statusItem.detail);
    statusItem.busy = true;

    const versionNumber: string = getTaskwarriorVersion(taskCli);
    statusItem.text = `Taskwarrior v${versionNumber}`;
    log.info(statusItem.text);
    statusItem.detail = `Last updated: ${getCurrentTimestamp()}`;
  } catch (error) {
    statusItem.text = "$(error) Taskwarrior";
    log.error(error?.message ?? error);
    if (error instanceof CliFailedError && "cause" in error) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      log.error(`> ${error.cause}`);
    }
  } finally {
    statusItem.busy = false;
  }
}

export function activate() {
  commands.registerCommand("taskwarrior.action.refresh", () => {
    refreshStatus(getTaskCli());
  });
  commands.registerCommand("taskwarrior.action.showLog", log.show, log);
  languages.registerInlayHintsProvider(
    languageSelector,
    getInlayHintsProvider(),
  );
  workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("taskwarrior")) {
      refreshStatus(getTaskCli());
    }
  });
  statusItem.command = {
    command: "taskwarrior.action.showLog",
    title: "Show extension log",
  };

  const cli: TaskCli = getTaskCli();
  refreshStatus(cli);

  languages.registerCodeLensProvider(
    languageSelector,
    getDependenciesCodeLensProvider(getDescriptionsByIdProvider(cli)),
  );

  return {
    getTaskwarriorVersion: () => getTaskwarriorVersion(getTaskCli()),
  };
}

export function deactivate() {
  return;
}
