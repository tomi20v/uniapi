export interface IPluginError {
  field: string;
  error: string;
  context?: any;
}
export interface IPluginEvent <T,U> {
  eventName: string;
  value?: T;
  oldValue?: U;
  errors: IPluginError[];
  context?: any;
}
