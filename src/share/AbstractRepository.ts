import {Observable} from "rxjs"
import {DeleteCommandResult, InsertCommandResult, RxCollectionInterface, UpdateCommandResult} from "../db"
import {CallableInterface} from "./CallableInterface"
import {FieldNameCleaner} from "./FieldNameCleaner";
import {ReplaySubject} from "rxjs/Rx";

const _ = require('lodash');

export abstract class AbstractRepository {

    protected abstract mongoCollectionName: string;
    protected abstract factory: CallableInterface<any>;

    rxCollection = new ReplaySubject<RxCollectionInterface>();

    constructor(
        private rxConnectionStream: Observable<any>,
        private fieldNameCleaner: FieldNameCleaner
    ) {
        this.rxConnectionStream.subscribe(
            (db) => this.rxCollection.next(
                db.collection(this.mongoCollectionName)
            ),
            () => null,
            () => this.rxCollection.complete()
        )
    }

    findById(id: string): Observable<any> {
        return this._catch(
            this.findOne({_id: id})
                .map(obj => {
                    if (!obj) {
                        throw null;
                    }
                    return obj;
                })
        );
    }

    find(filter: any): Observable<any> {
        return this._catch(
            this.rxCollection
                .flatMap(collection => collection.find(filter).toArray())
                .flatMap(r => <Observable<any>>r)
                .map(objData => this.factory(
                    this.fieldNameCleaner.restoreFieldNames(objData)
                ))
        );
    }

    findOne<T>(filter: T): Observable<T> {
        return this._catch(
            this.rxCollection
                .flatMap(collection => collection.findOne(filter))
                .map(objData => {
                    if (!objData) {
                        throw null;
                    }
                    return this.factory(
                        this.fieldNameCleaner.restoreFieldNames(objData)
                    )
                })
        );
    }

    remove(id: string): Observable<boolean> {
        return this._catch(
            this.rxCollection
                .flatMap(collection =>
                    collection.deleteOne({_id: id})
                )
                .map((commandResult: DeleteCommandResult) => {
                    if (commandResult.deletedCount != 1) {
                        throw commandResult.message;
                    }
                    return true;
                    })
        );
    }

    replace<T>(id: string, data: T): Observable<T> {
        let dataSent = this.toDb(data);
        return this._catch(
            this.rxCollection
                .map(collection => collection
                    .updateOne({_id: id}, dataSent)
                )
                .flatMap(r => r) // handle the promise returned
                .map((commandResult: UpdateCommandResult) => {
                    if (commandResult.modifiedCount !== 1) {
                        throw commandResult.message;
                    }
                    return dataSent;
                })
        );
    }

    protected _create(obj: any) {
        let dataSent = this.toDb(obj);
        return this._catch(
            this.rxCollection
                .flatMap(collection => collection.insert(dataSent))
                .map((commandResult: InsertCommandResult) => {
                    if (commandResult.insertedCount !== 1) {
                        throw commandResult.message;
                    }
                    if (commandResult.insertedId) {
                        dataSent[this._idField()] = commandResult.insertedId;
                    }
                    return dataSent;
                })
        );
    }

    /**
     * @return string id field name in the model
     */
    protected _idField() {
        return '_id';
    }

    private toDb(data: any) {
        const t = Math.floor(new Date().getTime() / 1000);
        return _.extend(
            {_id: data[this._idField()]},
            this.fieldNameCleaner.clearFieldNames(
                _.omit(data, this._idField())
            ),
            {
                _type: data.constructor.name,
                tstamp: t,
                crstamp: data.crstamp || t
            }
        )
    }

    private _catch(observable: Observable<any>) {
        return observable.catch(e => {
            throw (e||{}).message || e;
        })
    }
}
