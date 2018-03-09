import {IPluginHandlerDefinition, PluginInterface} from "./PluginInterface";
import {PluginConfigInterface} from "./PluginConfigInterface";
import {PluginEventInterface} from "./PluginEventInterface";
import {Observable, ReplaySubject} from "rxjs/Rx";
import {PluginInitDbInterface} from "./PluginInitDbInterface";

export interface IPluginWrapper {
    plugin: PluginInterface;
    config: PluginConfigInterface;
}

export class PluginManager {

    private plugins: PluginInterface[] = [];
    private pluginInitDbs: PluginInitDbInterface[] = [];
    private globalPluginConfigs = new ReplaySubject<PluginConfigInterface>();
    private globalPlugins = new ReplaySubject<IPluginWrapper>();

    registerPlugin(
        plugin: PluginInterface,
        pluginInitDB?: PluginInitDbInterface
    ) {
        this.plugins.push(plugin);
        if (pluginInitDB) {
            this.pluginInitDbs.push(pluginInitDB);
        }
    }

    // handleServerEvent(event: ServerEventInterface) {
    //     console.log('serverEvent: ', event);
    //     for (let i=0; i<this.plugins.length; i++) {
    //         this.plugins[i].handle(event, null);
    //     }
    // }

    instances() {
        return Observable.from(this.plugins);
    }

    initDbInstances() {
        return Observable.from(this.pluginInitDbs);
    }

    registerGlobalPluginConfigs(pluginConfigs: PluginConfigInterface[]){
        pluginConfigs.forEach(pluginConfig => {
            const plugin = this.pluginInstance(pluginConfig.pluginId);
            this.globalPlugins.next({plugin: plugin,config: pluginConfig});
        });
        this.globalPlugins.complete();
    }

    withGlobalPlugins(event: PluginEventInterface) {
        return this.globalPlugins
            .map(pluginWrapper => this.invokeHandle(pluginWrapper, event))
            .last();
    }

    private pluginInstance(pluginId: string) {
        let x = this.plugins
            .filter((plugin: PluginInterface) => plugin.id === pluginId);
        console.log('pluginInstance: ' , x);
        if (x.length) {
            return x[0];
        }

        throw 'plugin ' + pluginId + ' is not registered';
    }

    private invokeHandle(
        pluginWrapper: IPluginWrapper,
        event: PluginEventInterface
    ) {
        pluginWrapper.plugin.handlers.forEach(
            (def: IPluginHandlerDefinition) => {
                if (def.pattern.test(event.eventName)) {
                    event = def.callback(event, pluginWrapper.config);
                }
            }
        )
        return event;
    }

}
