import {IPluginHandlerDefinition, IPlugin} from "./plugin/IPlugin";
import {IPluginConfig} from "./IPluginConfig";
import {IPluginEvent} from "./pluginEvent/IPluginEvent";
import {Observable} from "rxjs/Rx";
import {IInitDb} from "./initDb/IInitDb";
import {EntityConfigRepository} from "../config/repository/EntityConfigRepository";
import {EntityConfig} from "../config/model/EntityConfig";
import {APlugin} from "./plugin/APlugin";
import {IPluginEvent2} from "./pluginEvent/IPluginEvents";

class $NullPlugin extends APlugin {
  readonly config: IPluginConfig;
  readonly configHash: string;
  readonly handlers: IPluginHandlerDefinition[] = [
    { pattern: /./, callback: this.handle}
  ];
  handle(event: IPluginEvent<any, any>) {
    console.log('$nullPlugin.handle', event.eventName);
    return event;
  }
}

export class PluginManager {

  private pluginInitDbs: IInitDb[] = [];
  private pluginClasses: object = {};
  private plugins: object = {};
  private globalPlugins: IPlugin[] = [];
  /** I need at least one enabled plugin */
  private nullPlugin: $NullPlugin;

  constructor(
    private entityRepository: EntityConfigRepository
  ) {
    const $nullConfig = <IPluginConfig>{
      pluginId: '$null',
      enabled: true
    };
    this.nullPlugin = new $NullPlugin(
      $nullConfig,
      this.configHash($nullConfig)
    );
  }

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

  registerGlobalPlugins(pluginConfigs: IPluginConfig[]) {
    // console.log('register global plugins', pluginConfigs);
    pluginConfigs.forEach(eachConfig => {
      this.globalPlugins.push(this.getInstance(eachConfig));
    });
  }

  // withGlobalPlugins$(event: IPluginEvent<any, any>) {
  withGlobalPlugins$(event: IPluginEvent2): Observable<IPluginEvent2> {
    if (!this.globalPlugins.length) {
      throw 'No global plugins loaded';
    }
    return Observable.from(this.globalPlugins)
      .filter(plugin => plugin.config.enabled)
      .map(plugin => this.invokeHandle(plugin, event))
      .last();
  }

  // withEntityPlugins$(entityId, event: IPluginEvent<any, any>) {
  withEntityPlugins$(entityId, event: IPluginEvent2): Observable<IPluginEvent2> {
    // get entity by id. note entityId might be empty if the routing regexp hasn't been matched
    return this.entityRepository.findById(entityId)
      // get entity's pluginconfigs
      .flatMap((entityConfig: EntityConfig) => entityConfig.plugins)
      // map them to plugininstances
      .map((pluginConfig: IPluginConfig) => this.getInstance(pluginConfig))
      // continue with empty stream onerror
      .catch(() => Observable.from([]))
      // add $nullPlugin to ensure at least oneenabled plugin
      .concat(() => Observable.from([this.nullPlugin]))
      // filter disabled plugins
      .filter((plugin: IPlugin) => plugin.config.enabled)
      // send event to all plugins
      .map(plugin => this.invokeHandle(plugin, event))
      // return last result which should be an event
      .last();
  }

  private configHash(config): string {
    const s = JSON.stringify(config);
    return '' + s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
  }

  private invokeHandle(
    plugin: IPlugin,
    // event: IPluginEvent<any, any>
    event: IPluginEvent2
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

  private getInstance(
    pluginConfig: IPluginConfig
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

}
