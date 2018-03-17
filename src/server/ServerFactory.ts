import * as express from "express";
import {AppConfigManager} from "./AppConfigManager";
import {EntityRouter} from "../entity/EntityRouter";
import {PluginManager} from "../plugins/PluginManager";
import {ServerConfigInterface} from "./ServerConfigInterface";
import {ServerEventInterface} from "./ServerEventInterface";
import {Subject} from "rxjs/Rx";
import {UniApiApp} from "../UniApiApp";
import {BootPluginsLocal} from "../../config/boot/BootPluginsLocal";
import {Server} from "./Server";
import {RepositoryFactory} from "../config/RepositoryFactory";
import {ConnectionFactory} from "../ConnectionFactory";
import {ServerConfigManager} from "./ServerConfigManager";
import {ConfigRouter} from "../config/ConfigRouter";

export class ServerFactory {

  makeServer(config: ServerConfigInterface): Server {
    const pluginManager = new PluginManager();
    const serverConfigManager = new ServerConfigManager();
    const repositoryFactory = new RepositoryFactory(
      new ConnectionFactory(serverConfigManager)
    );
    const appConfigManager = new AppConfigManager(
      repositoryFactory.appConfigRepository()
    );
    const configRouter = new ConfigRouter(repositoryFactory);
    return new Server(
      config,
      new Subject<ServerEventInterface>(),
      this.uniApiApp(
        pluginManager,
        configRouter,
        serverConfigManager,
        appConfigManager,
        repositoryFactory
      ),
      this.bootPlugins(pluginManager)
    );
  }

  private uniApiApp(
    pluginManager: PluginManager,
    configRouter: ConfigRouter,
    serverConfigManager: ServerConfigManager,
    appConfigManager: AppConfigManager,
    repositoryFactory: RepositoryFactory
  ) {
    return new UniApiApp(
      express(),
      new Subject<express.Application>(),
      serverConfigManager,
      appConfigManager,
      pluginManager,
      configRouter.router,
      new EntityRouter(
        pluginManager,
        repositoryFactory.entityConfigRepository()
      )
    );
  }

  private bootPlugins(
    pluginManager: PluginManager
  ) {
    return new BootPluginsLocal(pluginManager);
  }

}
