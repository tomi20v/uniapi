import {AbstractRepository} from "../share/AbstractRepository";
import {CallableInterface} from "../share/CallableInterface";
import {AppConfig} from "./model/AppConfig";

export class AppConfigRepository extends AbstractRepository {

    mongoCollectionName: string = 'uaAppConfig';

    factory: CallableInterface<any> = AppConfig.fromDb;

    create(appConfig: AppConfig) {
        return this._create(appConfig);
    }

}
