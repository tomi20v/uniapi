import * as _ from "lodash";
import * as defaultConfig from "../../../config/server.json";
import * as http from 'http';
import * as express from "express";
import {BootableInterface} from "../boot/BootableInterface";
import {ServerConfigInterface} from "./ServerConfigInterface";
import {ServerEventInterface} from "./ServerEventInterface";
import {Subject} from "rxjs/Rx";
import {UniApiApp} from "../UniApiApp";

export class Server {

    private server: http.Server;

    constructor(
        private config: ServerConfigInterface,
        private subject: Subject<ServerEventInterface>,
        private uniApiApp: UniApiApp,
        private bootPlugins: BootableInterface
    ) {
        this.config = _.merge(defaultConfig, config);
    }

    boot() {
        this.bootPlugins.boot();
    }

    start() {

        this.boot();

        this.subject.subscribe(
            (event: ServerEventInterface) => {
                if (event.eventName == 'server.init') {
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

    serverEvent(event: ServerEventInterface) {
        this.subject.next(event);
    }

    private initDeps() {
        // @todo I need some more decoupled implementation
        // this.configManager.init();
    }

}
