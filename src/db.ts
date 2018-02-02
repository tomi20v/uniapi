import * as defaultConfig from '../defaultConfig.json';
import {Observable} from "rxjs";
const rxMongoExports = require('rxmongo');
const RxMongo = rxMongoExports.RxMongo;

export const rxMongoDbStream = RxMongo.connect((<any>defaultConfig).storage.dsn);
rxMongoDbStream
    .subscribe(db => {
        console.log('mongo CONNECTED!');
    }, err => {
        console.log('mongo connect ERR', err);
    });

export interface InsertCommandResult {
    insertedId: string;
}
interface UpdateCommandResultInner {
    ok: number;
    n: number;
    nModified: number;
}
export interface UpdateCommandResult {
    result: UpdateCommandResultInner;
    connection: any;
    message: any;
    modifiedCount: number;
    upsertedId: any;
    upsertedCount: number;
    matchedCount: number;
}
export interface RxCollectionInterface {
    find(filter: any): RxCursorInterface;
    findById(id: string);
    findOne(filter: any);
    exists(query: any);
    insert(data: any);
    updateOne(filter: any, data: any);
    deleteById(id: string);
    deleteOne(filter: any);
}
export interface RxCursorInterface {
    // rxCursor;
    sort(sort): RxCursorInterface;
    limit(count: number): RxCursorInterface;
    skip(count: number): RxCursorInterface;
    // map(func: CallableInterface): Observable;
    // count(): Observable;
    // single(): Observable;
    // first(): Observable;
    toArray(): Observable<any[]>
}
