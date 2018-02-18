import {AppConfig} from "../config/model/AppConfig";
import {EntityConfig} from "../config/model/EntityConfig";
import {PluginConfigSchema} from "../config/model/PluginConfigSchema";
import {EntitySchema} from "../config/model/EntitySchema";

export interface InitDbData {
    appConfigs?: AppConfig[];
    entityConfigs?: EntityConfig[];
    pluginConfigSchemas?: PluginConfigSchema[];
    entitySchemas?: EntitySchema[];
}
