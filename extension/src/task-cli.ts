export { getTaskwarriorVersion } from "./task-cli/version";
export { getDescriptionsByIdProvider } from "./task-cli/descriptions";

export interface TaskCli {
  run(argv: string[]): Buffer | string;
}
