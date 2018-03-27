import {IPluginError} from "../plugin/IPluginError";
import {IContext} from "../IContext";

export interface IPluginEvent <T,U> {
  eventName: string;
  value?: T;
  oldValue?: U;
  errors: IPluginError[];
  context: IContext;
}
