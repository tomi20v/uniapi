import {CallableInterface} from "../share/CallableInterface";
import {PluginConfigSchema} from "../config/model/PluginConfigSchema";
import {AppConfig} from "../config/model/AppConfig";

export interface IInitDb {

  initDbPluginConfigSchema(
    data: PluginConfigSchema[],
    logger?: CallableInterface<any>
  ): PluginConfigSchema[];
  initDbAppConfig(
    data: AppConfig[],
    logger?: CallableInterface<any>
  ): AppConfig[];

}
