export interface IPluginError {
  fatal: boolean;
  field: string;
  error: string;
  context?: any;
}
