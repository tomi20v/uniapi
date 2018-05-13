import {$RestConfigActions} from "../$RestConfigInterface";
import {IPluginEntityEvent} from "../../../pluginEvent/IPluginEntityEvent";

export function onAfter(
  event: IPluginEntityEvent
): IPluginEntityEvent {
  if (event.target.handledBy !== this.id) {
  }
  switch (event.target.method) {
    case $RestConfigActions.get:
    case $RestConfigActions.getIndex:
    case $RestConfigActions.create:
    case $RestConfigActions.update:
    case $RestConfigActions.replace:
    case $RestConfigActions.replaceIndex:
    case $RestConfigActions.delete:
    case $RestConfigActions.deleteIndex:
  }
  return event;
}
