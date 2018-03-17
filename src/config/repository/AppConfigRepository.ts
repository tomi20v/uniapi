import {AbstractRepository} from "../../share/AbstractRepository";
import {AppConfig} from "../model/AppConfig";

export class AppConfigRepository extends AbstractRepository {

    mongoCollectionName: string = 'uaAppConfig';

    factory: ((data: object) => AppConfig) = AppConfig.fromDb;

    create(appConfig: AppConfig) {
        return this._create(appConfig);
    }

}
