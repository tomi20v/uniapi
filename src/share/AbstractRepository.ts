import {Observable} from "rxjs"
import {InsertCommandResult, RxCollectionInterface, UpdateCommandResult} from "../db"
import {CallableInterface} from "./CallableInterface"
import {FieldNameCleaner} from "./FieldNameCleaner";

const RxMongo = require('rxmongo');
const _ = require('lodash');

export abstract class AbstractRepository {

    protected abstract mongoCollectionName: string;
    protected abstract factory: CallableInterface<any>;

    rxCollection: Observable<RxCollectionInterface>;

    constructor(
        private rxMongoDbStream: Observable<RxCollectionInterface>,
        private fieldNameCleaner: FieldNameCleaner
    ) {
        this.rxCollection = rxMongoDbStream.map(
            db => new RxMongo.RxCollection(this.mongoCollectionName)
        );
    }

    findById(id: string): Observable<any> {
        return this.rxCollection
            .flatMap(rxCollection => rxCollection
                .findOne({_id: id})
            )
            .map(objData => objData
                ? this.factory(this.fieldNameCleaner.restoreFieldNames(objData))
                : null
            );
    }

    find(filter: any): Observable<any> {
        return this.rxCollection
            .flatMap(rxCollection => rxCollection
                .find(filter).toArray()
            )
            .flatMap(r => r)
            .map(objData => objData
                ? this.factory(this.fieldNameCleaner.restoreFieldNames(objData))
                : null
            );
    }

    findOne<T>(filter: T): Observable<T> {
        return this.rxCollection
            .flatMap(rxCollection => rxCollection
                .findOne(filter)
                .map(objData => objData
                    ? this.factory(this.fieldNameCleaner.restoreFieldNames(objData))
                    : null)
            );
    }

    remove(id: string): Observable<boolean> {
        return this.rxCollection
            .flatMap(rxCollection =>
                rxCollection.deleteOne({_id: id})
            )
            .map((commandResult: any) => commandResult.deletedCount == 1)
    }

    replace<T>(id: string, data: T): Observable<T> {
        return this.rxCollection
            .flatMap(rxCollection => rxCollection
                .updateOne(
                    {_id: id},
                    _.extend(
                        {_id: data[this._idField()]},
                        this.fieldNameCleaner.clearFieldNames(_.omit(data, this._idField())),
                        {
                            _type: data.constructor.name,
                            tstamp: new Date(),
                            crstamp: (<any>data).crstamp || new Date()
                        }
                    )
                )
            )
            .map((commandResult: UpdateCommandResult): T => {
                if (!commandResult.modifiedCount) {
                    throw(404);
                }
                return data;
            });
    }

    protected _create(obj: any) {
        let t = Math.floor(new Date().getTime()/1000);
        return this.rxCollection
            .flatMap(rxCollection => rxCollection.insert(
                _.extend(
                    {_id: obj[this._idField()]},
                    this.fieldNameCleaner.clearFieldNames(_.omit(obj, [this._idField()])),
                    {
                        _type: obj.constructor.name,
                        tstamp: t,
                        crstamp: obj.crstamp || t
                    }
                )
            ))
            .map((commandResult: InsertCommandResult) => {
                obj[this._idField()] = commandResult.insertedId;
                return obj;
            });
    }

    protected _idField() {
        return '_id';
    }

}
