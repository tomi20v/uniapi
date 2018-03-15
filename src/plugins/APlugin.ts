import {IPlugin, IPluginHandlerDefinition} from "./IPlugin";
import {PluginConfigInterface} from "./PluginConfigInterface";

export abstract class APlugin implements IPlugin {

  static readonly id;

  abstract readonly handlers: IPluginHandlerDefinition[];
  abstract readonly config: PluginConfigInterface;
  abstract readonly configHash: string;

}
