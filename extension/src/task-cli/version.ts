import { TaskCli } from "../task-cli";
import CliFailedError from "../errors/cli-failed";

const MAX_LENGTH = 256;

export const getTaskwarriorVersion = async (cli: TaskCli): Promise<string> => {
  let stdout: string | Buffer;
  try {
    stdout = await cli.run(["_version"]);
  } catch (error) {
    throw new CliFailedError("Unable to obtain Taskwarrior version", {
      cause: error,
    });
  }

  const stdoutString = typeof stdout === "string" ? stdout : stdout.toString();
  if (stdoutString.length > MAX_LENGTH) {
    throw new CliFailedError(
      `Excessive length: ${stdoutString.substring(0, MAX_LENGTH)}[…]`
    );
  }
  return stdoutString.trim();
};
