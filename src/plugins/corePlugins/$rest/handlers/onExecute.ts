import {IPluginEvent} from "../../../pluginEvent/IPluginEvent";
import {$RestConfigActions} from "../$RestConfigInterface";
import {IEntityTarget} from "../../../pluginEvent/IPluginEvents";

export function onExecute(
  event: IPluginEvent<IEntityTarget, IEntityTarget>
): IPluginEvent<IEntityTarget, IEntityTarget> {
  switch (event.value.method) {
    case $RestConfigActions.get:
      break;
    case $RestConfigActions.getIndex:
      break;
    case $RestConfigActions.create:
    case $RestConfigActions.update:
    case $RestConfigActions.replace:
    case $RestConfigActions.replaceIndex:
    case $RestConfigActions.delete:
    case $RestConfigActions.deleteIndex:
  }
  return event;
}
