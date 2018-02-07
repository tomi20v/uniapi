import * as express from 'express';
import * as bodyParser from "body-parser";
import {Subject} from "rxjs/Subject";
import {ConfigManager} from "./server/ConfigManager";
import {EntityRouter} from "./entity/EntityRouter";
import {AppConfig} from "./config/model/AppConfig";
import {PluginManager} from "./plugins/PluginManager";
import {ServerConfigInterface} from "./server/ServerConfigInterface";
// import * as compression from 'compression';

export class UniApiApp {

    constructor(
        public expressApp: express.Application,
        public appSubject: Subject<express.Application>,
        private configManager: ConfigManager,
        private pluginManager: PluginManager,
        private configRouter: express.Router,
        private entityRouter: EntityRouter
    ) {}

    public init() {

        this.configManager.serverConfig.subscribe(
            (serverConfig: ServerConfigInterface) => {
                // this.appConfigRepository.find({})

                this.expressApp.disable('x-powered-by');

                this.expressApp.use(bodyParser.json());
                // expressApp.use(compression());
                this.expressApp.use(bodyParser.urlencoded({ extended: false }));

                this.initRequestLogging(serverConfig);

                this.initPort(serverConfig);
                this.initClient(serverConfig);

                this.initRouting();

                this.initErrorHandling();

                this.configManager.appConfigStream
                    .delay(2000)
                    .subscribe((appConfig: AppConfig) => {
                        if (appConfig === null) {
                            throw 'app config not found';
                        }
                        this.pluginManager.registerGlobalPluginConfigs(appConfig.plugins);
                        this.appSubject.next(this.expressApp);
                    });

            }
        )

        return this.appSubject;

    }

    private initPort(serverConfig: ServerConfigInterface) {
        const configPort = serverConfig.server.port;
        const port = this.normalizePort(process.env.PORT || configPort);
        this.expressApp.set('port', port);
    }

    private normalizePort(val): boolean | number {
        const normalizedPort = parseInt(val, 10);
        if (isNaN(normalizedPort)) {
            // named pipe
            return val;
        }
        if (normalizedPort >= 0) {
            // port number
            return normalizedPort;
        }
        return false;
    }

    private initClient(serverConfig: ServerConfigInterface) {
        // serve client files if enabled
        if (serverConfig.client.enabled) {
            this.expressApp.use('/config/client/about', express.static('node_modules/uniapi-config-client/dist'));
            this.expressApp.use('/config/client/entities', express.static('node_modules/uniapi-config-client/dist'));
            this.expressApp.use('/config/client/entity/*', express.static('node_modules/uniapi-config-client/dist'));
            this.expressApp.use('/config/client', express.static('node_modules/uniapi-config-client/dist'));
            console.log('client enabled');
        }
    }

    private initRouting() {
        this.expressApp.use('/config', this.configRouter);
        this.expressApp.use('/rest', (req: express.Request, res: express.Response, next) => this.entityRouter.handle(req, res, next));
    }

    private initErrorHandling() {

        // catch 404 and forward to error handler
        this.expressApp.use(function(req: express.Request, res: express.Response, next) {
            let err = new Error('Not Found');
            next(err);
        });

        // production error handler
        // no stacktrace leaked to user
        this.expressApp.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {

            res.status(err.status || 500);
            res.json({
                error: {},
                message: err.message
            });

        });

    }

    private initRequestLogging(serverConfig: ServerConfigInterface) {
        if (serverConfig.server.useMorgan) {
            const morgan = require('morgan');
            this.expressApp.use(morgan('dev'));
        }
    }

}
