import {IPluginHandlerDefinition, IPlugin} from "./IPlugin";
import {PluginConfigInterface} from "./PluginConfigInterface";
import {PluginEventInterface} from "./PluginEventInterface";
import {Observable, ReplaySubject} from "rxjs/Rx";
import {PluginInitDbInterface} from "./PluginInitDbInterface";

export class PluginManager {

  private pluginInitDbs: PluginInitDbInterface[] = [];
  private pluginClasses: object = {};
  private plugins: object = {};
  private globalPlugins: IPlugin[] = [];

  registerPlugin(
    pluginId,
    pluginClass,
    pluginInitDB?: PluginInitDbInterface
  ) {
    this.pluginClasses[pluginId] = pluginClass;
    if (pluginInitDB) {
      this.pluginInitDbs.push(pluginInitDB);
    }
  }

  initDbInstances() {
    return Observable.from(this.pluginInitDbs);
  }

  registerGlobalPlugins(pluginConfigs: PluginConfigInterface[]) {
    console.log('register global plugins', pluginConfigs);
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

  withGlobalPlugins$(event: PluginEventInterface) {
    return Observable.from(this.globalPlugins)
      .map(plugin => this.invokeHandle(plugin, event))
      .last();
  }

  private invokeHandle(
    plugin: IPlugin,
    event: PluginEventInterface
  ) {
    plugin.handlers.forEach(
      (def: IPluginHandlerDefinition) => {
        if (def.pattern.test(event.eventName)) {
          // event = def.callback(event, plugin.config);
          event = def.callback(event);
        }
      }
    )
    return event;
  }

}
