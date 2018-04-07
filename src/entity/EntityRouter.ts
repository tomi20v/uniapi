import {NextFunction, Request, Response} from "express-serve-static-core";
import {PluginManager} from "../plugins/PluginManager";
import {Observable} from "rxjs/Observable";
import {EntityConfigRepository} from "../config/repository/EntityConfigRepository";
import {IEntityRequest, IEntityTarget, IPluginEvent2} from "../plugins/pluginEvent/IPluginEvents";
import {IContext} from "../plugins/IContext";
import {IPluginErrors} from "../plugins/plugin/IPluginErrors";
import {ILogger} from "../share/ILogger";


export class EntityRouter {

  constructor(
    private pluginManager: PluginManager,
    private entityConfigRepository: EntityConfigRepository,
    private logger: ILogger = console.log
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
            handledBy: null,
            result$: Observable.from([null])
          },
          oldValue$: null,
          errors: event.errors,
          context: event.context
      })
      .map(event => {
        this.logger('...executing ' + event.eventName);
        return event;
      })
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event));
    // this.dump(onRoute$, 'onRoute$');
    let onPostroute$ = onRoute$
      .map(event => <IPluginEvent2> {
        eventName: 'entity.postroute',
        request: event.request,
        target: event.target,
        oldValue$: event.oldValue$,
        errors: event.errors,
        context: event.context
      })
      .map(event => {
        this.logger('...executing ' + event.eventName);
        return event;
      })
      .flatMap(event => this.entityConfigRepository.findById(event.target.entity)
        .map(entityConfig => {
          event.target.entityConfig = entityConfig;
          return event;
        })
        .catch(e => Observable.throw(e))
      )
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event))
      .flatMap(event => this.pluginManager.withEntityPlugins$(event.target.entity, event))
    ;
    // this.dump(onPostroute$, 'onPostroute$');
    let onBefore$ = onPostroute$
      .map(event => <IPluginEvent2> {
        eventName: 'entity.before',
        request: event.request,
        target: event.target,
        oldValue$: null,
        errors: event.errors,
        context: event.context
      })
      .map(event => {
        this.logger('...executing ' + event.eventName);
        return event;
      })
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event))
      .flatMap(event => this.pluginManager.withEntityPlugins$(event.target.entity, event));
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
      .map(event => {
        this.logger('...executing ' + event.eventName);
        return event;
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
      })
      .map(event => {
        this.logger('...executing ' + event.eventName);
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
      .map(event => {
        this.logger('...executing ' + event.eventName);
        return event;
      })
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event));
    // this.dump(execute$, 'execute$');
    let final$ = execute$
      .catch(e => {
        console.log('final', e);
        throw e;
      });
    // final$.subscribe();
    // this.dump(final$, 'final$');

    // map entity config or reference into context
    final$.subscribe(
      (event: IPluginEvent2) => {
        if (!event.target.handledBy) {
          res.status(404);
          next();
        }
        else {
          event.target.result$
            .subscribe(
              result => {
                if (result.data === null) {
                  res.status(404);
                  next();
                }
                else {
                  res.send(result);
                }
              },
              err => {
                res.status(500);
                next();
              }
            )
        }
      },
      err => {
        res.status(500);
        next();
      }
    )

    // stream GET POST etc plugins here

    // console.log('NEXXXXXXXXT');
  }

  private throwErrors(event: IPluginEvent2): IPluginEvent2 {
    if (event.errors.length > 0) {
      throw event.errors;
    }
    return event;
  }

  private dump(o: Observable<any>, msg: string = 'dumping, emitted:') {
    o.subscribe(
    emitted => console.log(msg, emitted),
    e => console.log(msg + ' ...ERRR', e),
    () => console.log(msg + ' ...completed')
    );

  }
}
