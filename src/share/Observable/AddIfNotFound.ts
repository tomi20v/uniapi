import {CallableInterface} from "../CallableInterface";
import {Observable} from "rxjs/Rx";

const _ = require('lodash');

export function addIfNotFound<T>(
    o: Observable<T>,
    objs: T[],
    filterFn: CallableInterface<boolean>
): Observable<T> {
    return <Observable<T>>Observable.create(subscriber => {
        let source = o;
        let objsToAdd = objs;
        let subscription = source.subscribe(
            (value: any) => {
                try {
                    objsToAdd = _.filter(objsToAdd, obj => !filterFn(value, obj));
                    subscriber.next(value);
                }
                catch (err) {
                    subscriber.error(err);
                }
            },
            err => subscriber.error(err),
            () => {
                objsToAdd.forEach(eachToAdd => subscriber.next(eachToAdd));
                subscriber.complete();
            }
        )
        return subscription;
    })
}
