import {PluginInterface} from "./PluginInterface";
import {PluginConfigInterface} from "./PluginConfigInterface";
import {PluginEventInterface} from "./PluginEventInterface";
import {Observable, ReplaySubject} from "rxjs/Rx";
import {PluginInitDbInterface} from "./PluginInitDbInterface";

export class PluginManager {

    private plugins: PluginInterface[] = [];
    private pluginInitDbs: PluginInitDbInterface[] = [];
    private globalPluginConfigs = new ReplaySubject<PluginConfigInterface>();

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
        let x = this.plugins
            .filter((plugin: PluginInterface) => plugin.id === pluginId);
        console.log('pluginInstance: ' , x);
        if (x.length) {
            return x[0];
        }

        throw 'plugin ' + pluginId + ' is not registered';
    }
}
