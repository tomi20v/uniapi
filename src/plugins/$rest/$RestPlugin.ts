import {APlugin} from "../APlugin";
import {IPluginHandlerDefinition} from "../IPlugin";
import {PluginEventInterface} from "../PluginEventInterface";
import {$TimestampConfigInterface} from "../$timestamp/$TimestampConfigInterface";

export class $RestPlugin extends APlugin {

  static readonly id = '$rest';

  readonly handlers: IPluginHandlerDefinition[] = [
    { pattern: /entity\.route/, callback: this.onRoute }
  ]

  constructor(
    readonly config: $TimestampConfigInterface,
    readonly configHash: string
  ) {
    super();
  }

  public onRoute(event: PluginEventInterface) {
    console.log('onroute happened in $rest plugin', event.eventName);
    return event;
  }

}
