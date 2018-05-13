import {IPluginConfig} from "../IPluginConfig";
import {IPluginEntityEvent} from "../pluginEvent/IPluginEntityEvent";

export interface IPluginHandlerDefinition {
  pattern: RegExp;
  // callback: (...args: any[]) => IPluginEvent<any,any>;
  callback: (event: IPluginEntityEvent) => IPluginEntityEvent;
}

export interface IPlugin {

  readonly handlers: IPluginHandlerDefinition[];
  readonly config: IPluginConfig;
  readonly configHash: string;

}
