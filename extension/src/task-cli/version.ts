import CliFailedError from "../errors/cli-failed";
import { TaskCli } from "../task-cli";

const MAX_LENGTH = 256;

export function getTaskwarriorVersion(cli: TaskCli): string {
  let stdout: string | Buffer;
  try {
    stdout = cli.run(["_version"]);
  } catch (error) {
    throw new CliFailedError("Unable to obtain Taskwarrior version", {
      cause: error,
    });
  }

  const stdoutContent: string =
    typeof stdout === "string" ? stdout : stdout.toString();
  if (stdoutContent.length > MAX_LENGTH) {
    throw new CliFailedError(
      `Excessive length: ${stdoutContent.substring(0, MAX_LENGTH)}[…]`,
    );
  }
  return stdoutContent.trim();
}
