import {EntityRouter} from "../entity/EntityRouter";
import {ConfigManager} from "./ConfigManager";
import {UniApiApp} from "../UniApiApp";
import * as express from "express";
import {ServerEventInterface} from "./ServerEventInterface";
import {Subject} from "rxjs/Subject";
import {EntityManager} from "../entity/EntityManager";
import {PluginManager} from "../plugins/PluginManager";

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
interface DepsInterface {
    serverSubject?: Subject<ServerEventInterface>;
    expressApp?: express.Application;
    appSubject?: Subject<express.Application>;
    configManager?: ConfigManager;
    pluginManager?: PluginManager;
    configRouter?: express.Router;
    entityManager?: EntityManager;
    entityRouter?: EntityRouter;
    uniApiApp?: UniApiApp;
}
export interface ServerConfigInterface {
    server: ServerInterface;
    storage: StorageInterface;
    client: ClientInterface;
    deps?: DepsInterface;
}
