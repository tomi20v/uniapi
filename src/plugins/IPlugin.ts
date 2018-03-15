import {PluginEventInterface} from "./PluginEventInterface";
import {CallableInterface} from "../share/CallableInterface";
import {PluginConfigInterface} from "./PluginConfigInterface";

export interface IPluginHandlerDefinition {
  pattern: RegExp;
  callback: CallableInterface<PluginEventInterface>;
}

export interface IPlugin {

  readonly handlers: IPluginHandlerDefinition[];
  readonly config: PluginConfigInterface;
  readonly configHash: string;

}
