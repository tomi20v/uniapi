import {PluginConfigSchema} from "../../config/model/PluginConfigSchema";
import {AppConfig} from "../../config/model/AppConfig";
import {ILogger} from "../../share/ILogger";

export interface IInitDb {

  initDbPluginConfigSchema(
    data: PluginConfigSchema[],
    logger?: ILogger
  ): PluginConfigSchema[];
  initDbAppConfig(
    data: AppConfig[],
    logger?: ILogger
  ): AppConfig[];

}
