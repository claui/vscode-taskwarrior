export default interface Logger {
  debug(...args: any[]): void;
  error(...args: any[]): void;
  info(...args: any[]): void;
  log(level: string, ...args: any[]): void;
}
