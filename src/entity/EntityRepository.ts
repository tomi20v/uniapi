import {Observable} from "rxjs/Rx";
import {RxCollectionInterface} from "../db";

interface HasId {
  _id: any;
}

export class EntityRepository {

  private rxCollection: Observable<RxCollectionInterface>;

  constructor(
    readonly entityName: string,
    rxConnectionStream: Observable<any>,
  ) {
    this.rxCollection = rxConnectionStream
      .map(db => db.collection(entityName));
  }

  find$(filter: any): Observable<any> {
    return this.rxCollection
      .flatMap(collection => collection.find(filter).toArray());
  }

  create$<T>(data: T): Observable<T> {
    return this.rxCollection
      .flatMap(collection => collection.insert(data));
  }

  replace$(data: HasId): Observable<HasId> {
    if (!data._id) {
      throw 'no _id in ' + this.entityName + ' repository replace';
    }
    return this.rxCollection
      .flatMap(collection => collection.updateOne(
        {_id: data._id},
        data
      ));
  }

  remove$(id: string): Observable<any> {
    return this.rxCollection
      .flatMap(collection => collection.deleteById(id));
  }

}
