import {IPlugin, IPluginHandlerDefinition} from "./IPlugin";
import {IPluginConfig} from "../IPluginConfig";

export abstract class APlugin implements IPlugin {

  static readonly id;

  abstract readonly handlers: IPluginHandlerDefinition[];
  // abstract readonly config: IPluginConfig;
  // abstract readonly configHash: string;

  constructor(
    readonly config: IPluginConfig,
    readonly configHash: string
  ) {}

}
