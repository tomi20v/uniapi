import * as defaultConfig from '../../config/server.json';
import {ServerConfigInterface} from "./ServerConfigInterface";

export class ServerConfig {

    public defaultConfig: ServerConfigInterface;

    constructor() {
        this.defaultConfig = <any>defaultConfig
    }

}
