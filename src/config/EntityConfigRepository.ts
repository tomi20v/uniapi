import {EntityConfig} from "./model/EntityConfig";
import {AbstractRepository} from "../share/abstractRepository";
import {CallableInterface} from "../share/callableInterface";

export class EntityConfigRepository extends AbstractRepository {

    mongoCollectionName: string = 'ua_entity';

    factory: CallableInterface<any> = EntityConfig.fromDb;

    create(entity: EntityConfig) {
        return this._create(entity);
    }

}
