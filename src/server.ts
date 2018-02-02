import * as http from 'http';
import {configRouter} from "./config/routes";
import {UniApiApp} from "./app";
import {PluginEventInterface} from "./plugins/PluginEventInterface";
import {ServerConfig} from "./ServerConfig";
import * as express from "express";
import {EntityRouter} from "./entity/EntityRouter";
import {pluginManager} from "./plugins/plugins";

const expressApp: express.Application = express();
const serverConfig = new ServerConfig();
const entityRouter = new EntityRouter(
    pluginManager
);
const uniApiApp = new UniApiApp(expressApp, serverConfig, configRouter, entityRouter);

uniApiApp.serverEvents()
    .subscribe((event: PluginEventInterface) => {
        if (event.eventName == 'server.ready') {
            const server = http.createServer(uniApiApp.expressApp);
            const port = uniApiApp.expressApp.get('port');
            server.listen(port);
            console.log('listening on ' + port);
        }
    });

uniApiApp.init();
