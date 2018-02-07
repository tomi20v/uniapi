import {AbstractRepository} from "../share/abstractRepository";
import {CallableInterface} from "../share/callableInterface";
import {AppConfig} from "./model/AppConfig";

export class AppConfigRepository extends AbstractRepository {

    mongoCollectionName: string = 'ua_config';

    factory: CallableInterface<any> = AppConfig.fromDb;

    create(appConfig: AppConfig) {
        return this._create(appConfig);
    }

}
