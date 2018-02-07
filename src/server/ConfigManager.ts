import * as defaultConfig from '../../config/server.json';
import {ServerConfigInterface} from "./ServerConfigInterface";
import {AppConfigRepository} from "../config/AppConfigRepository";
import {AppConfig} from "../config/model/AppConfig";
import {Observable} from "rxjs/Rx";

export class ConfigManager {

    public serverConfig: Observable<ServerConfigInterface>;
    public appConfig: AppConfig;
    public appConfigStream: Observable<AppConfig>;

    constructor(
        private appConfigRepository: AppConfigRepository
    ) {

        this.serverConfig = Observable.of(<any>defaultConfig);
        this.appConfigStream = <Observable<AppConfig>>this.appConfigRepository
            .findOne({_id: '$appConfig'});
    }

}
