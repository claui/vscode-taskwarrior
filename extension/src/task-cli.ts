export { getTaskwarriorVersion } from "./task-cli/version";

export interface TaskCli {
  run(argv: string[]): Promise<Buffer | String>;
}
