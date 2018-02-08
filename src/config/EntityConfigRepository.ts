import {EntityConfig} from "./model/EntityConfig";
import {AbstractRepository} from "../share/AbstractRepository";
import {CallableInterface} from "../share/CallableInterface";

export class EntityConfigRepository extends AbstractRepository {

    mongoCollectionName: string = 'uaEntityConfig';

    factory: CallableInterface<any> = EntityConfig.fromDb;

    create(entity: EntityConfig) {
        return this._create(entity);
    }

}
