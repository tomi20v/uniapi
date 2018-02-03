import {EntityRouter} from "../entity/EntityRouter";
import {ServerConfig} from "./ServerConfig";
import {UniApiApp} from "../app";
import * as express from "express";
import {ServerEventInterface} from "./ServerEventInterface";
import {Subject} from "rxjs/Subject";
import {EntityManager} from "../entity/EntityManager";

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
    serverConfig?: ServerConfig;
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
