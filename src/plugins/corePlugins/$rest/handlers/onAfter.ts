import {$RestConfigActions} from "../$RestConfigInterface";
import {IPluginEvent2} from "../../../pluginEvent/IPluginEvents";

export function onAfter(
  event: IPluginEvent2
): IPluginEvent2 {
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
