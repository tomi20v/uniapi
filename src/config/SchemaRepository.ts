import {AbstractRepository} from "../share/abstractRepository";
import {CallableInterface} from "../share/callableInterface";
import {EntitySchema} from "./model/EntitySchema";
import {Observable} from "rxjs/Rx";

export class SchemaRepository extends AbstractRepository {

    mongoCollectionName: string = 'ua_schema';

    factory: CallableInterface<any> = EntitySchema.fromDb;

    create(schema: EntitySchema) {
        return this._create(schema);
    }

    protected _idField() {
        return '$id';
    }

}
