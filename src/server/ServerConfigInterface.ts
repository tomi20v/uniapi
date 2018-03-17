// import {EntityRouter} from "../entity/EntityRouter";
// import {AppConfigManager} from "./AppConfigManager";
// import {UniApiApp} from "../UniApiApp";
// import * as express from "express";
// import {ServerEventInterface} from "./ServerEventInterface";
// import {Subject} from "rxjs/Subject";
// import {EntityManager} from "../entity/EntityManager";
// import {PluginManager} from "../plugins/PluginManager";
// import {BootableInterface} from "../boot/BootableInterface";

interface ServerInterface {
  port: number;
  useMorgan: boolean;
}
interface StorageInterface {
  dsn: string;
}
interface ClientInterface {
  enabled: boolean;
}
// export interface ServerDepsInterface {
//   serverSubject?: Subject<ServerEventInterface>;
//   expressApp?: express.Application;
//   appSubject?: Subject<express.Application>;
//   configManager?: AppConfigManager;
//   pluginManager?: PluginManager;
//   bootPlugins?: BootableInterface;
//   router?: express.Router;
//   entityManager?: EntityManager;
//   entityRouter?: EntityRouter;
//   uniApiApp?: UniApiApp;
// }
export interface ServerConfigInterface {
  server: ServerInterface;
  storage: StorageInterface;
  client: ClientInterface;
  // deps?: ServerDepsInterface;
}
