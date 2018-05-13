import {IPluginEntityEvent} from "../../../pluginEvent/IPluginEntityEvent";

export function onPreRoute(
  event: IPluginEntityEvent
): IPluginEntityEvent {

  if (event.request.url.substr(-1) == '/') {
    event.context[this.CONTEXT_HAS_TRAILING_SLASH] = true;
    event.request.url = event.request.url.replace(/\/$/, '');
  }

  return event;

}
