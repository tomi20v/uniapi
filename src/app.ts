import {configRouter} from "./config/routes";
import * as defaultConfig from '../defaultConfig.json';
import * as express from 'express';
import * as bodyParser from "body-parser";
// import * as compression from 'compression';
const morgan = require('morgan');

function normalizePort(val): boolean | number {

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

const app: express.Application = express();

app.disable('x-powered-by');

app.use(bodyParser.json());
// app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

const configPort = (<any>defaultConfig).server.port;
const port = normalizePort(process.env.PORT || configPort);
app.set('port', port);

// serve client files if enabled
if ((<any>defaultConfig).client.enabled) {
    app.use('/config/client/about', express.static('node_modules/uniapi-config-client/dist'));
    app.use('/config/client/entities', express.static('node_modules/uniapi-config-client/dist'));
    app.use('/config/client/entity/*', express.static('node_modules/uniapi-config-client/dist'));
    app.use('/config/client', express.static('node_modules/uniapi-config-client/dist'));
    console.log('client enabled');
}

// app.use('/api/public', publicRouter);
app.use('/config', configRouter);

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next) {
    let err = new Error('Not Found');
    next(err);
});

// production error handler
// no stacktrace leaked to user
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {

    res.status(err.status || 500);
    res.json({
        error: {},
        message: err.message
    });
});

export { app }
