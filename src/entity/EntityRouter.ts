import {NextFunction, Request, Response} from "express-serve-static-core";
import {PluginManager} from "../plugins/PluginManager";
import {IPluginError, IPluginEvent} from "../plugins/IPluginEvent";
import {IHttpRequest} from "../share/IHttpRequest";
import {Observable, ReplaySubject} from "rxjs/Rx";
import {EntityConfigRepository} from "../config/repository/EntityConfigRepository";
import {EntityError} from "./EntityError";

export interface IEntityRequest extends IHttpRequest {}
export interface IEntityTarget {
  pathParts: string;
  entity: string;
  entityId: string;
  method: string;
  data$: Observable<any>;
  isHandled?: boolean;
}

export interface IEntityValidationError extends IPluginError {}

export class EntityRouter {

  constructor(
    private pluginManager: PluginManager,
    private entityRepository: EntityConfigRepository
  ) {}

  handle(req: Request, res: Response, next: NextFunction): any {

    let request = <IEntityRequest>{
      headers: req.headers,
      url: req.url,
      method: req.method,
      params: req.params,
      body: req.body
    }
    let context = {};
    // console.log('original event', event);
    let preRouted$ = this.pluginManager
      .withGlobalPlugins$(<IPluginEvent<IEntityRequest,null>>{
        eventName: 'entity.preRoute',
        // oldValue: request,
        // value: target,
        value: request,
        errors: [],
        context: context
      });
    // this.dump(preRouted$);
    let routed$ = preRouted$
      .map(event => <IPluginEvent<IEntityTarget, IEntityRequest>> {
          eventName: 'entity.route',
          value: <IEntityTarget>{
            pathParts: event.value.url,
            entity: null,
            entityId: null,
            method: null,
            data$: null
          },
          oldValue: event.value,
          errors: event.errors,
          context: event.context
      })
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event));
    // this.dump(routed$, 'routed$');
    let before$ = routed$
      .map(event => <IPluginEvent<IEntityTarget, IEntityTarget>> {
        eventName: 'entity.before',
        value: event.value,
        oldValue: {
          pathParts: event.value.pathParts,
          entity: event.value.entity,
          entityId: event.value.entityId,
          method: null,
          data$: null
        },
        errors: event.errors,
        context: event.context
      })
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event));
    // this.dump(before$, 'before$');
    let validate$ = before$
      .map(event => <IPluginEvent<IEntityTarget, IEntityTarget>> {
        eventName: 'entity.validate',
        value: event.value,
        oldValue: event.oldValue,
        errors: event.errors,
        context: event.context,
        isHandled: false
      })
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event))
      .map(event => {
        if (!event.value.isHandled) {
          throw new EntityError(404);
        }
        return event;
      })
      .map(event => this.throwErrors(event));
    // this.dump(validate$, 'validate$');
    let execute$ = validate$
      .map(event => <IPluginEvent<any,any>> {
        eventName: 'entity.execute',
        value: event.value,
        oldValue: event.oldValue,
      })
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event));
    this.dump(execute$, 'execute$');


    // map entity config or reference into context

    // stream GET POST etc plugins here

    // console.log('NEXXXXXXXXT');
    next();
  }

  private throwErrors <T,U> (event: IPluginEvent<T, U>): IPluginEvent<T, U> {
    if (event.errors.length > 0) {
      throw event.errors;
    }
    return event;
  }

  private dump(o: Observable<any>, msg: string = 'dumping, emitted:') {
    o.subscribe(
    emitted => console.log(msg, emitted),
    e => console.log('err', e),
    () => console.log('completed')
    );

  }
}
