import {PluginInterface} from "./PluginInterface";
import {AbstractSchema} from "../model/AbstractSchema";

export class PluginManager {

    private plugins: PluginInterface[] = [];
    private schemas: AbstractSchema[] = [];

    registerPlugin(plugin: PluginInterface, configSchema: AbstractSchema) {
        this.plugins.push(plugin);
        this.schemas.push(configSchema);
    }

    getPlugins(): PluginInterface[] {
        return this.plugins;
    }

}
