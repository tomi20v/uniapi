import {Observable} from "rxjs";
const rxMongoExports = require('rxmongo');

interface InsertCommandResultInner {
  ok: number;
  n: number;
}
export interface InsertCommandResult {
  result: InsertCommandResultInner;
  connection: any;
  message: any;
  ops: any;
  insertedCount: number;
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
export interface DeleteCommandResult {
  result: InsertCommandResultInner;
  connection: any;
  message: string;
  deletedCount: number;
}
export interface RxCollectionInterface {
  find(filter: any);
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
