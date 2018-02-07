import * as defaultConfig from "../../config/server.json";
import * as http from 'http';
import * as express from "express";
import {UniApiApp} from "../UniApiApp";
import {ConfigManager} from "./ConfigManager";
import {EntityRouter} from "../entity/EntityRouter";
import {ServerConfigInterface} from "./ServerConfigInterface";
import {configRouter} from "../config/routes";
import {pluginManager} from "../plugins/plugins";

import * as _ from "lodash";
import {Subject} from "rxjs/Subject";
import {ServerEventInterface} from "./ServerEventInterface";
import {EntityManager} from "../entity/EntityManager";
import {appConfigRepository, entityConfigRepository, entitySchemaRepository} from "../config/repositories";
import {PluginManager} from "../plugins/PluginManager";
import {PluginInterface} from "../plugins/PluginInterface";
import {PluginConfigSchema} from "../config/model/PluginConfigSchema";

export class Server {

    private config: ServerConfigInterface;
    private expressApp: express.Application;
    private appSubject: Subject<express.Application>;
    private configManager: ConfigManager;
    private pluginManager: PluginManager;
    private configRouter: express.Router;
    private entityManager: EntityManager;
    private entityRouter: EntityRouter;
    private uniApiApp: UniApiApp;

    private server: http.Server;

    private subject: Subject<ServerEventInterface>;

    constructor(config: ServerConfigInterface) {
        this.config = _.merge(defaultConfig, config);
        const deps = config.deps || {};
        this.subject = deps.serverSubject || new Subject<ServerEventInterface>();
        this.expressApp = deps.expressApp || express();
        this.appSubject = deps.appSubject || new Subject<express.Application>();
        this.configManager = deps.configManager || new ConfigManager(appConfigRepository);
        this.pluginManager = deps.pluginManager || pluginManager;
        this.configRouter = deps.configRouter || configRouter;
        this.entityManager = deps.entityManager || new EntityManager(entityConfigRepository, entitySchemaRepository);
        this.entityRouter = deps.entityRouter || new EntityRouter(pluginManager);
        this.uniApiApp = deps.uniApiApp || new UniApiApp(
            this.expressApp,
            this.appSubject,
            this.configManager,
            this.pluginManager,
            this.configRouter,
            this.entityRouter
        );

    }

    public start() {

        this.uniApiApp.init()
            .subscribe(
                (expressApp: express.Application) => {
                    this.server = http.createServer(expressApp);
                    const port = expressApp.get('port');
                    this.server.listen(port);
                    console.log('listening on ' + port);
                    this.subject.next(<ServerEventInterface>{
                        eventName: 'server.ready',
                        data: 'Server'
                    });
                }
            )
    }

    public registerPlugin(plugin: PluginInterface, schema: PluginConfigSchema) {
        this.pluginManager.registerPlugin(plugin, schema);
    }

}
