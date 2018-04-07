import {$RestConfigActions} from "../$RestConfigInterface";
import {IPluginEvent2} from "../../../pluginEvent/IPluginEvents";

export function onValidate(
  event: IPluginEvent2
): IPluginEvent2 {
  if (event.target.handledBy !== this.id) {
    return event;
  }
  switch (event.target.method) {
    case $RestConfigActions.replace:
    case $RestConfigActions.delete:
    case $RestConfigActions.update:
      // I should throw here if previous not found
      event.target.handledBy = this.id;
      break;
    case $RestConfigActions.create:
      // I should throw here if ID is sent and exists
      event.target.handledBy = this.id;
      break;
    case $RestConfigActions.replaceIndex:
    case $RestConfigActions.deleteIndex:
      event.target.handledBy = this.id;
      break;
    case $RestConfigActions.get:
    case $RestConfigActions.getIndex:
      event.target.handledBy = this.id;
  }
  return event;
}
