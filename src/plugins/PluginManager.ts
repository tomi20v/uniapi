import {PluginInterface} from "./PluginInterface";
import {AbstractSchema} from "../model/AbstractSchema";
import {PluginConfigInterface} from "./PluginConfigInterface";
import {PluginEventInterface} from "./PluginEventInterface";
import {ServerEventInterface} from "../server/ServerEventInterface";
import {Subject} from "rxjs/Subject";

/** @TODO PluginConfigSchemaManager should be abstracted */
export class PluginManager {

    private plugins: PluginInterface[] = [];
    private schemas: AbstractSchema[] = [];
    // private globalPluginConfigs: PluginConfigInterface[] = [];
    private globalPluginConfigs = new Subject<PluginConfigInterface>();

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
        // this.globalPluginConfigs = plugins;
        let bugfix = [];
        for (let i in plugins) {
            if (plugins.hasOwnProperty(i)) {
                bugfix.push(plugins[i]);
            }
        }
        console.log('globalpluginconfigs loaded', bugfix);
        bugfix.forEach(eachBugfixed => this.globalPluginConfigs.next(eachBugfixed));
    }

    withGlobalPlugins(event: PluginEventInterface) {
        console.log('withglobalplugins');
        this.globalPluginConfigs
            .subscribe(
                (config: PluginConfigInterface) => {
            // )
            // .forEach((config: PluginConfigInterface) => {
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
