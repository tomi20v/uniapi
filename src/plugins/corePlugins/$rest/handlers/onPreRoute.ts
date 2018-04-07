import {IPluginEvent2} from "../../../pluginEvent/IPluginEvents";

export function onPreRoute(
  event: IPluginEvent2
): IPluginEvent2 {

  if (event.request.url.substr(-1) == '/') {
    event.context[this.CONTEXT_HAS_TRAILING_SLASH] = true;
    event.request.url = event.request.url.replace(/\/$/, '');
  }

  return event;

}
