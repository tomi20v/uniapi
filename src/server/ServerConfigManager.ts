import * as defaultConfig from '../../../config/server.json';
import {ServerConfigInterface} from "./ServerConfigInterface";
import {Observable} from "rxjs/Rx";

export class ServerConfigManager {

    serverConfig: Observable<ServerConfigInterface>;

    constructor(
    ) {
        this.serverConfig = Observable.of(<any>defaultConfig);
        this.init();
    }

    public init() {}

}
