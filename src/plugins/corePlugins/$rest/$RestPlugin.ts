import {APlugin} from "../../plugin/APlugin";
import {IPluginHandlerDefinition} from "../../plugin/IPlugin";
import {$RestConfigInterface} from "./$RestConfigInterface";
import {AbstractRepository} from "../../../share/AbstractRepository";
import * as handlers from "./handlers/handlers";
import {IPluginEvent2} from "../../pluginEvent/IPluginEvents";

export class $RestPlugin extends APlugin {

  private readonly CONTEXT_HAS_TRAILING_SLASH = 'hasTrailingSlash';

  static readonly id = '$rest';

  readonly handlers: IPluginHandlerDefinition[] = [
    { pattern: /entity\.preRoute/, callback: this.onPreRoute },
    { pattern: /entity\.route/, callback: handlers.onRoute },
    { pattern: /entity\.postroute/, callback: handlers.onPostroute },
    { pattern: /entity\.before/, callback: handlers.onBefore },
    { pattern: /entity\.validate/, callback: handlers.onValidate },
    { pattern: /entity\.execute/, callback: handlers.onExecute },
  ]

  constructor(
    readonly config: $RestConfigInterface,
    readonly configHash: string
  ) {
    super(config, configHash);
  }

  public onPreRoute(event: IPluginEvent2) {
    if (event.request.url.substr(-1) == '/') {
      event.context[this.CONTEXT_HAS_TRAILING_SLASH] = true;
      event.request.url = event.request.url.replace(/\/$/, '');
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
