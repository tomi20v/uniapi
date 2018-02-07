import {Observable} from "rxjs"
import {RxCollectionInterface, UpdateCommandResult} from "../db"
import {CallableInterface} from "./callableInterface"

const RxMongo = require('rxmongo');
const _ = require('lodash');

export abstract class AbstractRepository {

    protected abstract mongoCollectionName: string;
    protected abstract factory: CallableInterface<any>;

    rxCollection: Observable<RxCollectionInterface>;

    constructor(rxMongoDbStream: Observable<RxCollectionInterface>) {
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
                ? this.factory(this._restoreFieldNames(objData))
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
                ? this.factory(this._restoreFieldNames(objData))
                : null)

    }

    findOne(filter: any) {

        return this.rxCollection
            .flatMap(rxCollection => rxCollection
                .findOne(filter)
                .map(objData => objData
                    ? this.factory(this._restoreFieldNames(objData))
                    : null)
            )

    }

    remove(id: string) {

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
                        this._clearFieldNames(_.omit(data, this._idField())),
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
                    this._clearFieldNames(_.omit(obj, [this._idField()])),
                    {
                        _type: obj.constructor.name,
                        tstamp: t,
                        crstamp: obj.crstamp || t
                    }
                )
            ))
            .map(commandResult => obj);

    }

    protected _clearFieldNames(obj: any) {
        let ret = {};
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                let clearKey = i[0] == '$' ? '_'+i : i;
                ret[clearKey] = _.isObject(obj[i])
                    ? this._clearFieldNames(obj[i])
                    : obj[i];
            }
        }
        return ret;
    }

    protected _restoreFieldNames(obj: any) {
        let ret = {};
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                let restoredKey = i.substr(0, 2) === '_$'
                    ? i.substr(1)
                    : i;
                ret[restoredKey] = _.isObject(obj[i])
                    ? this._restoreFieldNames(obj[i])
                    : obj[i];
            }
        }
        return ret;
    }

    protected _idField() {
        return '_id';
    }

}
