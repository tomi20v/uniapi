import {IHttpRequest} from "../../share/IHttpRequest";
import {Observable} from "rxjs/Rx";
import {IPluginError} from "../plugin/IPluginError";
import {IContext} from "../IContext";
import {EntityConfig} from "../../config/model/EntityConfig";

export interface IEntityRequest
  extends IHttpRequest {}

export interface IEntityValue {
  value: any;
  [key: string]: any;
}

export interface IEntityTarget {
  pathParts: string;
  entityName: string;
  entityId: string;
  entityConfig: EntityConfig;
  constraints: object;
  method: string;
  inData: any;
  // subsequent plugins may load additional data in oldValue$ that's why the
  // relevant data is put on .value field
  oldValue$: Observable<IEntityValue>;
  targetValue$: Observable<any>;
  handledBy: string;
}

export interface IPluginEntityEvent {
  eventName: string;
  request: IEntityRequest;
  target: IEntityTarget;
  oldValue$: Observable<any>;
  result$: Observable<any>;
  errors: IPluginError[];
  context: IContext;
}

