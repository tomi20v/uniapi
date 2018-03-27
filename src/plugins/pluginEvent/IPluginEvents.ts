import {IHttpRequest} from "../../share/IHttpRequest";
import {Observable} from "rxjs/Rx";
import {IPluginError} from "../plugin/IPluginError";
import {IContext} from "../IContext";
import {EntityConfig} from "../../config/model/EntityConfig";

export interface IEntityRequest
  extends IHttpRequest {}

export interface IEntityTarget {
  pathParts: string;
  entity: string;
  entityId: string;
  entityConfig: EntityConfig;
  constraints: object;
  method: string;
  data: any;
  handledBy: string;
  result: object;
}

export interface IPluginEvent2 {
  eventName: string;
  request: IEntityRequest;
  target: IEntityTarget;
  oldValue$: Observable<any>;
  errors: IPluginError[];
  context: IContext;
}

