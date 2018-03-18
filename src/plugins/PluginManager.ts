import {IPluginHandlerDefinition, IPlugin} from "./IPlugin";
import {PluginConfigInterface} from "./PluginConfigInterface";
import {IPluginEvent} from "./IPluginEvent";
import {Observable} from "rxjs/Rx";
import {IInitDb} from "./IInitDb";

export class PluginManager {

  private pluginInitDbs: IInitDb[] = [];
  private pluginClasses: object = {};
  private plugins: object = {};
  private globalPlugins: IPlugin[] = [];

  registerPlugin(
    pluginId,
    pluginClass,
    pluginInitDB?: IInitDb
  ) {
    this.pluginClasses[pluginId] = pluginClass;
    if (pluginInitDB) {
      this.pluginInitDbs.push(pluginInitDB);
    }
  }

  initDbInstances$() {
    return Observable.from(this.pluginInitDbs);
  }

  registerGlobalPlugins(pluginConfigs: PluginConfigInterface[]) {
    // console.log('register global plugins', pluginConfigs);
    pluginConfigs.forEach(eachConfig => {
      this.globalPlugins.push(this.getInstance(eachConfig));
    });
  }

  private getInstance(
    pluginConfig: PluginConfigInterface
  ): IPlugin {
    const hash = this.configHash(pluginConfig);
    let plugin: IPlugin = this.plugins[hash] || null;
    if (!plugin) {
      const pluginClass = this.pluginClasses[pluginConfig.pluginId];
      if (!pluginClass) {
        console.log('ignoring unknown plugin: ', pluginClass);
      }
      else {
        plugin = new pluginClass(pluginConfig, hash);
        this.plugins[hash] = plugin;
      }
    }
    return plugin;
  }

  configHash(config): string {
    const s = JSON.stringify(config);
    return '' + s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
  }

  withGlobalPlugins$(event: IPluginEvent<any, any>) {
    return Observable.from(this.globalPlugins)
      .filter(plugin => plugin.config.enabled)
      .map(plugin => this.invokeHandle(plugin, event))
      .last();
  }

  private invokeHandle(
    plugin: IPlugin,
    event: IPluginEvent<any, any>
  ) {
    plugin.handlers.forEach(
      (def: IPluginHandlerDefinition) => {
        if (def.pattern.test(event.eventName)) {
          event = def.callback.call(plugin, event);
        }
      }
    );
    return event;
  }

}
