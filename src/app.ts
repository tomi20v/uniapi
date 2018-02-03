import * as express from 'express';
import * as bodyParser from "body-parser";
import {pluginManager} from "./plugins/plugins";
import {Subject} from "rxjs/Subject";
import {ServerConfig} from "./server/ServerConfig";
import {EntityRouter} from "./entity/EntityRouter";
import {ServerEventInterface} from "./server/ServerEventInterface";
// import * as compression from 'compression';
const morgan = require('morgan');

export class UniApiApp {

    constructor(
        public expressApp: express.Application,
        private serverConfig: ServerConfig,
        private configRouter: express.Router,
        private entityRouter: EntityRouter,
        private serverSubject: Subject<ServerEventInterface>
    ) {}

    public init() {

        pluginManager.constructor;

        this.expressApp.disable('x-powered-by');

        this.expressApp.use(bodyParser.json());
        // expressApp.use(compression());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));

        this.initRequestLogging();

        this.initPort();
        this.initClient();

        this.initRouting();

        this.initErrorHandling();

        this.serverSubject.next(<ServerEventInterface>{
            eventName: 'server.ready',
            data: 'UniApiApp'
        });

    }

    private initPort() {
        const configPort = this.serverConfig.defaultConfig.server.port;
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

    private initClient() {
        // serve client files if enabled
        if (this.serverConfig.defaultConfig.client.enabled) {
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

    private initRequestLogging() {
        if (this.serverConfig.defaultConfig.server.useMorgan) {
            this.expressApp.use(morgan('dev'));
        }
    }
}
