import {AbstractRepository} from "../share/AbstractRepository";
import {CallableInterface} from "../share/CallableInterface";
import {EntitySchema} from "./model/EntitySchema";
import {Observable} from "rxjs/Rx";

export class SchemaRepository extends AbstractRepository {

    mongoCollectionName: string = 'uaEntitySchema';

    factory: CallableInterface<any> = EntitySchema.fromDb;

    create(schema: EntitySchema) {
        return this._create(schema);
    }

    protected _idField() {
        return '$id';
    }

}
