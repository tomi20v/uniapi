import {IPluginEvent} from "../pluginEvent/IPluginEvent";
import {IPluginConfig} from "../IPluginConfig";

export interface IPluginHandlerDefinition {
  pattern: RegExp;
  callback: (...args: any[]) => IPluginEvent<any,any>;
}

export interface IPlugin {

  readonly handlers: IPluginHandlerDefinition[];
  readonly config: IPluginConfig;
  readonly configHash: string;

}
