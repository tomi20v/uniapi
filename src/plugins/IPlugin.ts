import {IPluginEvent} from "./IPluginEvent";
import {PluginConfigInterface} from "./PluginConfigInterface";

export interface IPluginHandlerDefinition {
  pattern: RegExp;
  callback: (...args: any[]) => IPluginEvent<any,any>;
}

export interface IPlugin {

  readonly handlers: IPluginHandlerDefinition[];
  readonly config: PluginConfigInterface;
  readonly configHash: string;

}
