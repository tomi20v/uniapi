import {NextFunction, Request, Response} from "express-serve-static-core";
import {PluginManager} from "../plugins/PluginManager";
import {Observable} from "rxjs/Rx";
import {EntityConfigRepository} from "../config/repository/EntityConfigRepository";
import {IEntityRequest, IEntityTarget, IPluginEvent2} from "../plugins/pluginEvent/IPluginEvents";
import {IContext} from "../plugins/IContext";
import {IPluginErrors} from "../plugins/plugin/IPluginErrors";

export class EntityRouter {

  constructor(
    private pluginManager: PluginManager,
    private entityRepository: EntityConfigRepository
  ) {}

  handle(req: Request, res: Response, next: NextFunction): any {

    let originalEvent = <IPluginEvent2>{
      eventName: 'entity.preRoute',
      request: <IEntityRequest>{
        headers: req.headers,
        url: req.url,
        method: req.method,
        params: req.params,
        body: req.body
      },
      target: null,
      oldValue$: null,
      errors: [],
      context: <IContext> {}
    };
    // console.log('original event', event);
    let onPreRoute$ = this.pluginManager.withGlobalPlugins$(originalEvent);
    // this.dump(onPreRoute$);
    let onRoute$ = onPreRoute$
      .map(event => <IPluginEvent2> {
          eventName: 'entity.route',
          request: event.request,
          target: <IEntityTarget>{
            pathParts: event.request.url,
            entity: null,
            entityId: null,
            entityConfig: null,
            constraints: {},
            method: null,
            data: null,
            handledBy: null
          },
          oldValue$: null,
          errors: event.errors,
          context: event.context
      })
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event));
    // this.dump(onRoute$, 'onRoute$');
    let onPostroute = onRoute$
      .map(event => <IPluginEvent2> {
        eventName: 'entity.postroute',
        request: event.request,
        target: event.target,
        oldValue$: event.oldValue$,
        errors: event.errors,
        context: event.context
      })
      .flatMap(event => this.entityRepository.findById(event.target.entity)
          .map(entityConfig => {
            event.target.entityConfig = entityConfig;
            return event;
          })
      )
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event))
      .flatMap(event => this.pluginManager.withEntityPlugins$(event.target.entityId, event));
    let onBefore$ = onPostroute
      .map(event => <IPluginEvent2> {
        eventName: 'entity.before',
        request: event.request,
        target: event.target,
        oldValue$: null,
        errors: event.errors,
        context: event.context
      })
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event))
      .flatMap(event => this.pluginManager.withEntityPlugins$(event.target.entityId, event));
    // this.dump(onBefore$, 'onBefore$');
    let onValidate$ = onBefore$
      .map(event => <IPluginEvent2> {
        eventName: 'entity.validate',
        request: event.request,
        target: event.target,
        oldValue$: event.oldValue$,
        errors: event.errors,
        context: event.context
      })
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event))
      .map(event => this.throwErrors (event));
    // this.dump(validate$, 'validate$');
    let validated$ = onValidate$
      .map((event: IPluginEvent2) => {
        if (event.errors.filter(error => error.fatal).length) {
          throw <IPluginErrors>{
            errors: event.errors
          };
        }
        return event;
      });
    let execute$ = validated$
      .map(event => <IPluginEvent2> {
        eventName: 'entity.execute',
        request: event.request,
        target: event.target,
        oldValue$: event.oldValue$,
        errors: event.errors,
        context: event.context
      })
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event));
    this.dump(execute$, 'execute$');

    // map entity config or reference into context

    // stream GET POST etc plugins here

    // console.log('NEXXXXXXXXT');
    next();
  }

  private throwErrors (event: IPluginEvent2): IPluginEvent2 {
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
