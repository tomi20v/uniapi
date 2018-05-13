import {IPluginHandlerDefinition, IPlugin} from "./plugin/IPlugin";
import {IPluginConfig} from "./IPluginConfig";
import {Observable} from "rxjs/Rx";
import {IInitDb} from "./initDb/IInitDb";
import {EntityConfigRepository} from "../config/repository/EntityConfigRepository";
import {EntityConfig} from "../config/model/EntityConfig";
import {IPluginEntityEvent} from "./pluginEvent/IPluginEntityEvent";
import {EntityRepositoryManager} from "../entity/EntityRepositoryManager";

export class PluginManager {

  private pluginInitDbs: IInitDb[] = [];
  private pluginClasses: object = {};
  private plugins: object = {};
  private globalPlugins: IPlugin[] = [];

  /** I need at least one enabled plugin */
  constructor(
    private entityConfigRepository: EntityConfigRepository,
    private entityRepositoryManager: EntityRepositoryManager
  ) {}

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
  withGlobalPlugins$(event: IPluginEntityEvent): Observable<IPluginEntityEvent> {
    if (!this.globalPlugins.length) {
      throw 'No global plugins loaded';
    }
    return Observable.from(this.globalPlugins)
      .filter(plugin => plugin.config.enabled)
      .map(plugin => this.invokeHandle(plugin, event))
      .last();
  }

  withEntityPlugins$(entityId, event: IPluginEntityEvent): Observable<IPluginEntityEvent> {
    // get entity by id. note entityId might be empty if the routing regexp hasn't been matched
    return this.entityConfigRepository.findById(entityId)
    // get entity's pluginconfigs
      .flatMap((entityConfig: EntityConfig) => entityConfig.plugins)
      // map them to plugininstances
      .map((pluginConfig: IPluginConfig) => this.getInstance(pluginConfig))
      // filter disabled plugins
      .filter((plugin: IPlugin) => plugin.config.enabled)
      // send event to all plugins
      .map(plugin => this.invokeHandle(plugin, event))
      // return last result which should be an event
      .last()
      .catch(() => [event]);
  }

  private configHash(config): string {
    const s = JSON.stringify(config);
    return '' + s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
  }

  private invokeHandle(
    plugin: IPlugin,
    event: IPluginEntityEvent
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
        plugin = new pluginClass(pluginConfig, hash, this.entityRepositoryManager);
        this.plugins[hash] = plugin;
      }
    }
    return plugin;
  }

}
