import {AbstractRepository} from "../../share/AbstractRepository";
import {EntitySchema} from "../model/EntitySchema";

export class SchemaRepository extends AbstractRepository {

    mongoCollectionName: string = 'uaEntitySchema';

    factory: ((data: object) => EntitySchema) = EntitySchema.fromDb;

    create(schema: EntitySchema) {
        return this._create(schema);
    }

    protected _idField() {
        return '$id';
    }

}
