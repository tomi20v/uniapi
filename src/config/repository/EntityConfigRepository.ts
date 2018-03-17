import {EntityConfig} from "../model/EntityConfig";
import {AbstractRepository} from "../../share/AbstractRepository";

export class EntityConfigRepository extends AbstractRepository {

    mongoCollectionName: string = 'uaEntityConfig';

    factory: ((data: object) => EntityConfig) = EntityConfig.fromDb;

    create(entity: EntityConfig) {
        return this._create(entity);
    }

}
