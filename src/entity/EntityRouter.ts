import {NextFunction, Request, Response} from "express-serve-static-core";
import {Context} from "../plugins/Context";
import {PluginManager} from "../plugins/PluginManager";
import {PluginEventInterface} from "../plugins/PluginEventInterface";
import {IHttpRequest} from "../share/IHttpRequest";
import {EntityConfig} from "../config/model/EntityConfig";
import {Observable} from "rxjs/Rx";
import {EntityConfigRepository} from "../config/repository/EntityConfigRepository";

export interface IEntityRequest extends IHttpRequest {
    entityConfig?: EntityConfig
}
interface IEntityTarget {
  entity: string;
  method: string;
  params: any;
  body: any;
}

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

        let event = <PluginEventInterface>{
            eventName: 'entity.preroute',
            value: request,
            context: new Context(req, res)
        };
        // console.log('original event', event);
        let preRouted$ = this.pluginManager
            .withGlobalPlugins(event);
        let target$ = preRouted$
          .map((event: PluginEventInterface) => {
            return <IEntityTarget>{
              entity: event.value.url,
              method: event.value.method,
              params: event.value.params,
              body: event.value.body
            };
          });
        this.dump(target$);

        // map entity config or reference into context

        // stream GET POST etc plugins here

        // console.log('NEXXXXXXXXT');
        next();
    }

    private dump(o: Observable<any>, msg: string = 'dumping, emitted:') {
      o.subscribe(
        emitted => console.log(msg, emitted),
        e => console.log('err', e),
        () => console.log('completed')
      );

    }
}
