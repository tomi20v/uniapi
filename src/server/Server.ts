import * as defaultConfig from "../../config/server.json";
import * as http from 'http';
import * as express from "express";
import {UniApiApp} from "../app";
import {ServerConfig} from "./ServerConfig";
import {EntityRouter} from "../entity/EntityRouter";
import {ServerConfigInterface} from "./ServerConfigInterface";
import {configRouter} from "../config/routes";
import {pluginManager} from "../plugins/plugins";

import * as _ from "lodash";
import {Subject} from "rxjs/Subject";
import {ServerEventInterface} from "./ServerEventInterface";
import {EntityManager} from "../entity/EntityManager";
import {entityRepository, schemaRepository} from "../config/repositories";

export class Server {

    private config: ServerConfigInterface;
    private expressApp: express.Application;
    private serverConfig: ServerConfig;
    private configRouter: express.Router;
    private entityManager: EntityManager;
    private entityRouter: EntityRouter;
    private uniApiApp: UniApiApp;

    private server: http.Server;

    private subject: Subject<ServerEventInterface>;
    private eventsToWaitFor = ['EntityManager', 'UniApiApp'];

    constructor(config: ServerConfigInterface) {
        this.config = _.merge(defaultConfig, config);
        const deps = config.deps || {};
        this.subject = deps.serverSubject || new Subject<ServerEventInterface>();
        this.expressApp = deps.expressApp || express();
        this.serverConfig = deps.serverConfig || new ServerConfig();
        this.configRouter = deps.configRouter || configRouter;
        this.entityManager = deps.entityManager || new EntityManager(entityRepository, schemaRepository, this.subject);
        this.entityRouter = deps.entityRouter || new EntityRouter(pluginManager);
        this.uniApiApp = deps.uniApiApp || new UniApiApp(
            this.expressApp,
            this.serverConfig,
            this.configRouter,
            this.entityRouter,
            this.subject
        );

    }

    public start() {

        this.initEventsToWaitFor();

        this.subject.subscribe(
            (event: ServerEventInterface) => {
                if ((event.eventName == 'server.ready') && (event.data === 'Server')) {
                    this.server = this.server || http.createServer(this.expressApp);
                    const port = this.expressApp.get('port');
                    this.server.listen(port);
                    console.log('listening on ' + port);
                }
                else if (event.eventName == 'server.init') {
                    switch (event.data) {
                        case 'Server':
                            this.initDeps();
                            break;
                        default:
                            let l = event.data[0].toLowerCase() + event.data.substr(1);
                            if (this.hasOwnProperty(l)) {
                                this[l].init();
                            }
                    }
                }
            });

        this.initDeps();
    }

    public initDeps() {

        this.entityManager.init();
        this.uniApiApp.init();

    }

    private initEventsToWaitFor() {
        let eventWaitStack = this.eventsToWaitFor;
        this.subject.subscribe(
            (event: ServerEventInterface) => {
                if ((event.eventName == 'server.ready') && (event.data !== 'Server')) {
                    let indexOf = eventWaitStack.indexOf(event.data);
                    if (indexOf !== -1) {
                        eventWaitStack.splice(indexOf, 1);
                        console.log('dep ' + event.data + ' ready...');
                        if (!eventWaitStack.length) {
                            this.subject.next(<ServerEventInterface>{
                                eventName: 'server.ready',
                                data: 'Server'
                            });
                        }
                    }
                }
            }
        );
    }

}
