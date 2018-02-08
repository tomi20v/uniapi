import {PluginInterface} from "./PluginInterface";
import {AbstractSchema} from "../model/AbstractSchema";
import {PluginConfigInterface} from "./PluginConfigInterface";
import {PluginEventInterface} from "./PluginEventInterface";
import {ServerEventInterface} from "../server/ServerEventInterface";
import {ReplaySubject} from "rxjs/ReplaySubject";

/** @TODO PluginConfigSchemaManager should be abstracted */
export class PluginManager {

    private plugins: PluginInterface[] = [];
    private schemas: AbstractSchema[] = [];
    private globalPluginConfigs = new ReplaySubject<PluginConfigInterface>();

    registerPlugin(plugin: PluginInterface, configSchema: AbstractSchema) {
        this.plugins.push(plugin);
        this.schemas.push(configSchema);
    }

    handleServerEvent(event: ServerEventInterface) {
        console.log('serverEvent: ', event);
        for (let i=0; i<this.plugins.length; i++) {
            this.plugins[i].handle(event, null);
        }
    }

    registerGlobalPluginConfigs(plugins: PluginConfigInterface[]) {
        console.log('globalpluginconfigs registered');
        plugins.forEach(eachPlugin => this.globalPluginConfigs.next(eachPlugin));
    }

    withGlobalPlugins(event: PluginEventInterface) {
        console.log('withglobalplugins');
        this.globalPluginConfigs
            .subscribe(
                (config: PluginConfigInterface) => {
                    // console.log('firing', event.eventName, config);
                const plugin = this.pluginInstance(config.pluginId);
                plugin.handle(event, config);
            })
    }

    private pluginInstance(pluginId: string) {
        for (let i=0; i<this.plugins.length; i++) {
            if (this.schemas[i].$id == pluginId) {
                return this.plugins[i];
            }
        }
        throw 'plugin ' + pluginId + ' is not registered';
    }
}
