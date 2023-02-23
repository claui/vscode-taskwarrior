import CliFailedError from "../errors/cli-failed";
import { DescriptionsByIdProvider } from "../attributes";
import { TaskCli } from "../task-cli";

const MAX_NUM_DESCRIPTIONS = 256;

export function getDescriptionsByIdProvider(
  cli: TaskCli,
): DescriptionsByIdProvider {
  return {
    map(taskFilter) {
      let stdout: string | Buffer;
      try {
        stdout = cli.run([taskFilter, "_zshids"]);
      } catch (error) {
        throw new CliFailedError("Unable to obtain task descriptions", {
          cause: error,
        });
      }

      const descriptionsById = new Map<string, string>();
      const stdoutContent: string =
        typeof stdout === "string" ? stdout : stdout.toString();
      for (const line of stdoutContent.split(/[\r\n]/g, MAX_NUM_DESCRIPTIONS)) {
        if (!line) {
          continue;
        }
        const [id, description] = line.split(":");
        descriptionsById.set(id, description);
      }

      return descriptionsById;
    },
  };
}
