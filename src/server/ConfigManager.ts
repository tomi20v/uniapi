import * as defaultConfig from '../../config/server.json';
import {ServerConfigInterface} from "./ServerConfigInterface";
import {AppConfigRepository} from "../config/AppConfigRepository";
import {AppConfig} from "../config/model/AppConfig";
import {Observable} from "rxjs/Rx";

export class ConfigManager {

    serverConfig: Observable<ServerConfigInterface>;
    appConfig: Observable<AppConfig>;

    constructor(
        private appConfigRepository: AppConfigRepository
    ) {
        this.serverConfig = Observable.of(<any>defaultConfig);
        this.init();
    }

    public init() {
        this.appConfig = <Observable<AppConfig>>this.appConfigRepository
            .findOne({_id: '$appConfig'});
    }

}
