import {NextFunction, Request, Response} from "express-serve-static-core";
import {PluginManager} from "../plugins/PluginManager";
import {Observable} from "rxjs/Observable";
import {EntityConfigRepository} from "../config/repository/EntityConfigRepository";
import {IEntityRequest, IEntityTarget, IPluginEntityEvent} from "../plugins/pluginEvent/IPluginEntityEvent";
import {IContext} from "../plugins/IContext";
import {IPluginErrors} from "../plugins/plugin/IPluginErrors";
import {ILogger} from "../share/ILogger";
import {SchemaRepository} from "../config/repository/SchemaRepository";
const _ = require('lodash');

export class EntityRouter {

  constructor(
    private pluginManager: PluginManager,
    private entityConfigRepository: EntityConfigRepository,
    private entitySchemaRepository: SchemaRepository,
    private logger: ILogger = console.log
  ) {}

  handle(req: Request, res: Response, next: NextFunction): any {

    let originalEvent = <IPluginEntityEvent>{
      eventName: 'entity.preRoute',
      request: <IEntityRequest>{
        headers: req.headers,
        url: req.url,
        method: req.method,
        params: req.params,
        body: req.body
      },
      target: null,
      errors: [],
      context: <IContext> {}
    };
    // console.log('original event', event);
    let onPreRoute$ = this.pluginManager.withGlobalPlugins$(originalEvent);
    // this.dump(onPreRoute$);
    let onRoute$ = onPreRoute$
      .map(event => <IPluginEntityEvent> {
          eventName: 'entity.route',
          request: event.request,
          target: <IEntityTarget>{
            pathParts: event.request.url,
            entityName: null,
            entityId: null,
            entityConfig: null,
            constraints: {},
            method: null,
            inData: null,
            oldValue$: null,
            handledBy: null,
          },
          result$: null,
          errors: event.errors,
          context: event.context
      })
      .map(event => this.logAndReturn(event))
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event));
    // this.dump(onRoute$, 'onRoute$');
    let onPostroute$ = onRoute$
      .map(event => <IPluginEntityEvent> {
        eventName: 'entity.postroute',
        request: event.request,
        target: event.target,
        result$: null,
        errors: event.errors,
        context: event.context
      })
      .map(event => this.logAndReturn(event))
      .flatMap(event => this.entityConfigRepository.findById(event.target.entityName)
        .map(entityConfig => {
          event.target.entityConfig = entityConfig;
          return event;
        })
        .catch(e => Observable.throw(e))
      )
      .flatMap(event => this.entitySchemaRepository.findById(event.target.entityConfig.schema)
        .map(entitySchema => {
          event.target.entitySchema = entitySchema;
          return event;
        })
        .catch(e => Observable.throw(e))
      )
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event))
      .flatMap(event => this.pluginManager.withEntityPlugins$(event.target.entityName, event))
    ;
    // this.dump(onPostroute$, 'onPostroute$');
    let onLoad$ = onPostroute$
      .map(event => <IPluginEntityEvent> {
        eventName: 'entity.load',
        request: event.request,
        target: event.target,
        result$: null,
        errors: event.errors,
        context: event.context
      })
      .map(event => this.logAndReturn(event))
        .flatMap(event => this.pluginManager.withGlobalPlugins$(event))
        .flatMap(event => this.pluginManager.withEntityPlugins$(event.target.entityName, event));
    let onBefore$ = onLoad$
      .map(event => <IPluginEntityEvent> {
        eventName: 'entity.before',
        request: event.request,
        target: event.target,
        result$: Observable.from([null]),
        errors: event.errors,
        context: event.context
      })
      .map(event => this.logAndReturn(event))
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event))
      .flatMap(event => this.pluginManager.withEntityPlugins$(event.target.entityName, event));
    // this.dump(onBefore$, 'onBefore$');
    let onValidate$ = onBefore$
      .map(event => <IPluginEntityEvent> {
        eventName: 'entity.validate',
        request: event.request,
        target: event.target,
        result$: event.result$,
        errors: event.errors,
        context: event.context
      })
      .map(event => this.logAndReturn(event))
      .flatMap(event => this.pluginManager.withGlobalPlugins$(event))
      .map(event => this.throwErrors (event));
    // this.dump(validate$, 'validate$');
    let validated$ = onValidate$
      .map((event: IPluginEntityEvent) => {
        if (event.errors.filter(error => error.fatal).length) {
          throw <IPluginErrors>{
            errors: event.errors
          };
        }
        return event;
      })
      .map(event => this.logAndReturn(event));
    let execute$ = validated$
      .map(event => <IPluginEntityEvent> {
        eventName: 'entity.execute',
        request: event.request,
        target: event.target,
        result$: event.result$,
        errors: event.errors,
        context: event.context
      })
      .map(event => this.logAndReturn(event))
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
      (event: IPluginEntityEvent) => {
        if (!event.target.handledBy) {
          res.status(404);
          next();
        }
        else {
          event.result$
            .subscribe(
              result => {
                // @todo I shouldn't have to trigger a 404 here, do I? (eg. delete doesn't have result)
                // if (result.data === null) {
                //   res.status(404);
                //   next();
                //     return;
                // }
                const success = !result.status || (result.status == 200);
                if (result.status) {
                  res.status(result.status);
                  delete result.status;
                }
                res.send(_.extend(
                  { success: success },
                  result
                ));
              },
              err => {
                res.status(500);
                console.log('happened', err);
                next();
              }
            )
        }
      },
      err => {
        res.status(500);
        // console.log('happened', err);
        next();
      }
    )

  }

  private throwErrors(event: IPluginEntityEvent): IPluginEntityEvent {
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

  private logAndReturn(event: IPluginEntityEvent): IPluginEntityEvent {
    this.logger('...executing ' + event.eventName);
    return event;
  }
}
