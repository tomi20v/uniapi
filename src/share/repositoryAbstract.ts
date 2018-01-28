import {Observable} from "rxjs"
import {InsertCommandResult, RxCollectionInterface, RxCursorInterface, UpdateCommandResult} from "../db"
import {CallableInterface} from "./callableInterface"

const RxMongo = require('rxmongo');
const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');

export abstract class RepositoryAbstract {

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
            .flatMap(
                rxCollection => rxCollection
                    .findById(id)
                    // @todo should rather use this but must be tested before
                    // .find(ObjectID(id))
                    .map(objData => objData ? this.factory(objData) : null)
            )
    }

    find(filter: any): Observable<any> {

        return this.rxCollection
            .flatMap(
                rxCollection => rxCollection.find(filter).toArray()
            )
            .flatMap(r => r)
            .map(objData => objData ? this.factory(objData) : null)

    }

    findOne(filter: any) {

        return this.rxCollection
            .flatMap(
                rxCollection => rxCollection.findOne(filter)
                    .map(objData => objData ? this.factory(objData) : null)
            )

    }

    remove(id: string) {
        return this.rxCollection
            .flatMap(
                rxCollection => {
                    return rxCollection.deleteById(id)
                }
            );
    }

    // replace<T>(id: string, data: T): Observable<T> {
    replace<T>(id: string, data: T): Observable<T> {
        return this.rxCollection
            .flatMap(
                rxCollection => {
                    return rxCollection.updateOne({_id: id}, data);
                }
            )
            .map((commandResult: UpdateCommandResult): T => {
                if (!commandResult.modifiedCount) {
                    throw(404);
                }
                return data;
            });
    }

    protected _create(obj: any) {
        return this.rxCollection
            .flatMap(rxCollection => rxCollection.insert(
                _.extend(
                    {
                        _id: RxMongo.ObjectID(obj.id),
                        _type: obj.constructor.name,
                        tstamp: new Date(),
                        crstamp: obj.crstamp || new Date()
                    },
                    _.omit(obj, ['id', 'tstamp', 'crstamp'])
                )
            ));
    }

}
