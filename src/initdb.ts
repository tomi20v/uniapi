import * as appConfigs from "../../data/config/_appConfigs.json";
import * as entityConfigs from "../../data/config/_entityConfigs.json";
import * as entitySchemas from "../../data/config/_entitySchemas.json";

import {PluginConfigSchema} from "./config/model/PluginConfigSchema";
import {EntityConfig} from "./config/model/EntityConfig";
import {EntitySchema} from "./config/model/EntitySchema";
import {AppConfig} from "./config/model/AppConfig";
import {RepositoryFactory} from "./config/RepositoryFactory";
import {ConnectionFactory} from "./ConnectionFactory";
import {ServerConfigManager} from "./server/ServerConfigManager";
import {addIfNotFound} from "./share/Observable/AddIfNotFound";
import {BootPluginsLocal} from "../config/boot/BootPluginsLocal";
import {PluginManager} from "./plugins/PluginManager";
import {IInitDb} from "./plugins/IInitDb";
import {TaskRunner} from "./share/TaskRunner";

const logger = console.log;

const repos = new RepositoryFactory(
  new ConnectionFactory(
    new ServerConfigManager(),
    logger
  )
);

let pluginManager = new PluginManager();
const bootPlugins = new BootPluginsLocal(pluginManager);
bootPlugins.boot(true);

const taskRunner = new TaskRunner({
  'pluginConfigSchema init': repos.pluginConfigSchemaRepository()
    .find({_id: {$regex: /^\$/}})
    .flatMap(each => repos.pluginConfigSchemaRepository().remove(each.$id))
    .toArray()
    .map(() => [])
    .flatMap(data => pluginManager.initDbInstances$().map(
      (initDbActor: IInitDb) => initDbActor
        .initDbPluginConfigSchema(data, logger)
    ))
    .flatMap(data => data)
    .flatMap((each: PluginConfigSchema) =>
      repos.pluginConfigSchemaRepository().create(each)
    ),
  'appConfig init': repos.appConfigRepository()
    .find({})
    .let(o => addIfNotFound(
      o,
      <any>appConfigs,
      (a: AppConfig, b: AppConfig) => a._id == b._id
    ))
    .toArray()
    .flatMap(dbConfigs => pluginManager.initDbInstances$().map(
      (initDbActor: IInitDb) => initDbActor
        .initDbAppConfig(dbConfigs, logger)
    ))
    .flatMap(r => r)
    .flatMap((eachConfig: AppConfig) => eachConfig.crstamp
      ? repos.appConfigRepository().replace(eachConfig._id, eachConfig)
      : repos.appConfigRepository().create(eachConfig)
    ),
  'entityConfig init': repos.entityConfigRepository()
    .find({_id: {$regex: /^\$/}})
    .flatMap(each => repos.entityConfigRepository().remove(each._id))
    .toArray()
    .flatMap(r => <any>entityConfigs)
    .flatMap((each: EntityConfig) => repos.entityConfigRepository().create(each)),
  'entitySchema init': repos.entitySchemaRepository()
    .find({_id: {$regex: /^\$/}})
    .flatMap(each => repos.entitySchemaRepository().remove(each.$id))
    .toArray()
    .flatMap(r => <any>entitySchemas)
    .flatMap((eachSchema: EntitySchema) => repos.entitySchemaRepository()
      .create(eachSchema))
}, process.exit, logger);
taskRunner.run();

console.log('initDb working...');
