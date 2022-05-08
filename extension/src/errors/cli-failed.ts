export default class CliFailedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
