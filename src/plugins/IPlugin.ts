import {PluginEventInterface} from "./PluginEventInterface";
import {PluginConfigInterface} from "./PluginConfigInterface";

export interface IPluginHandlerDefinition {
  pattern: RegExp;
  callback: (...args: any[]) => PluginEventInterface;
}

export interface IPlugin {

  readonly handlers: IPluginHandlerDefinition[];
  readonly config: PluginConfigInterface;
  readonly configHash: string;

}
