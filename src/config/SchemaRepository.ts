import {RepositoryAbstract} from "../share/repositoryAbstract";
import {CallableInterface} from "../share/callableInterface";
import {Schema} from "../model/Schema";
import {Observable} from "rxjs/Rx";

export class SchemaRepository extends RepositoryAbstract {

    mongoCollectionName: string = 'ua_schema';

    factory: CallableInterface<any> = Schema.fromDb;

    create(schema: Schema) {
        return this._create(schema);
    }

    findById(id: string): Observable<any> {
        return this.findOne({_id: id});
    }

}
