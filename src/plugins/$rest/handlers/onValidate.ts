import {IPluginEvent} from "../../IPluginEvent";
import {IEntityTarget} from "../../../entity/EntityRouter";
import {$RestConfigActions} from "../$RestConfigInterface";

export function onValidate(
  event: IPluginEvent<IEntityTarget, IEntityTarget>
): IPluginEvent<IEntityTarget, IEntityTarget> {
  switch (event.value.method) {
    case $RestConfigActions.replace:
    case $RestConfigActions.delete:
    case $RestConfigActions.update:
      // I should throw here if previous not found
      event.value.isHandled = true;
      break;
    case $RestConfigActions.create:
      // I should throw here if ID is sent and exists
      event.value.isHandled = true;
      break;
    case $RestConfigActions.replaceIndex:
    case $RestConfigActions.deleteIndex:
      event.value.isHandled = true;
      break;
    case $RestConfigActions.get:
    case $RestConfigActions.getIndex:
      event.value.isHandled = true;
  }
  return event;
}
