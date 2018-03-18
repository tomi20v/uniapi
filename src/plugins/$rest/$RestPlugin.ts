import {APlugin} from "../APlugin";
import {IPluginHandlerDefinition} from "../IPlugin";
import {IPluginEvent} from "../IPluginEvent";
import {IEntityRequest, IEntityTarget} from "../../entity/EntityRouter";
import {$RestConfigInterface} from "./$RestConfigInterface";
import {AbstractRepository} from "../../share/AbstractRepository";
import * as handlers from "./handlers/handlers";

export class $RestPlugin extends APlugin {

  private readonly CONTEXT_HAS_TRAILING_SLASH = 'hasTrailingSlash';

  static readonly id = '$rest';

  readonly handlers: IPluginHandlerDefinition[] = [
    { pattern: /entity\.preRoute/, callback: this.onPreRoute },
    { pattern: /entity\.route/, callback: handlers.onRoute },
    { pattern: /entity\.before/, callback: handlers.onBefore },
    { pattern: /entity\.validate/, callback: handlers.onValidate },
    { pattern: /entity\.execute/, callback: handlers.onExecute },
  ]

  constructor(
    readonly config: $RestConfigInterface,
    readonly configHash: string
  ) {
    super();
  }

  public onPreRoute(event: IPluginEvent<IEntityRequest,null>) {
    // console.log('it happened in $rest plugin', event.eventName);
    if (event.value.url.substr(-1) == '/') {
      event.context[this.CONTEXT_HAS_TRAILING_SLASH] = true;
      event.value.url = event.value.url.replace(/\/$/, '');
    }
    return event;
  }

  /**
   * @todo implement to get a repository for the target entity
   */
  private entityRepository(entity: string): AbstractRepository {
    // if (!entity) {
    //   throw 'target entity missing';
    // }
    // const repository = ...;
    // if (repository === null) {
    //   throw 'repository is null';
    // }
    return null;
  }

}
