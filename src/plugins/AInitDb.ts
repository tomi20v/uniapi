import {IInitDb} from "./IInitDb";
import {PluginConfigSchema} from "../config/model/PluginConfigSchema";
import {AppConfig} from "../config/model/AppConfig";
import {PluginConfigInterface} from "./PluginConfigInterface";

const _ = require('lodash');

export abstract class AInitDb implements IInitDb {

  protected abstract configSchema: PluginConfigSchema;

  /** these will be automatically registered into the default appConfig */
  protected abstract defaultAppConfigs: PluginConfigInterface[];

  initDbPluginConfigSchema(
    data: PluginConfigSchema[],
    logger: (msg: string) => null
  ): PluginConfigSchema[] {
    const pluginId = this.configSchema.$id;
    if (!_.filter(
      data,
      (eachSchema: PluginConfigSchema) => eachSchema.$id == pluginId
    ).length) {
      data.push(this.configSchema);
      logger('...' + this.configSchema.$id + ' plugin config added');
    }
    return data;
  }

  initDbAppConfig(
    data: AppConfig[],
    logger: (msg: string) => null
  ): AppConfig[] {
    data.forEach((eachAppConfig: AppConfig) => {
      const pluginId = this.configSchema.$id;
      if (!_.filter(
        eachAppConfig.plugins,
        (eachPlugin: PluginConfigInterface) => eachPlugin.pluginId === pluginId
      ).length) {
        this.defaultAppConfigs.forEach(eachPluginConfig => {
          eachAppConfig.plugins.push(eachPluginConfig)
          logger('...' + eachPluginConfig.pluginId + ' plugin added to appConfig ' + eachAppConfig._id);
        });
      }
    });
    return data;
  }

}
