import {$RestConfigActions} from "../$RestConfigInterface";
import {IPluginEntityEvent} from "../../../pluginEvent/IPluginEntityEvent";

export function onLoad(
  event: IPluginEntityEvent
): IPluginEntityEvent {
  if (event.target.handledBy !== this.id) {
    return event;
  }
  switch (event.target.method) {
    case $RestConfigActions.get:
    case $RestConfigActions.replace:
    case $RestConfigActions.delete:
    case $RestConfigActions.update:
      if (!event.target.entityId.length) {
        throw 'target entity id missing';
      }
      // instead of findById I use previously set event.target.constraints
      event.target.oldValue$ = this.entityRepository(event.target.entityName)
        .find$(event.target.constraints)
        .toArray()
        .map(oldValueInArr => {
          return {
            value: oldValueInArr[0]
          }
        });
      break;
    case $RestConfigActions.create:
      // I should check for existing duplicates here?
      break;
    case $RestConfigActions.getIndex:
    case $RestConfigActions.replaceIndex:
    case $RestConfigActions.deleteIndex:
      // I use previously set event.target.constraints
      event.target.oldValue$ = this.entityRepository(event.target.entityName)
        .find$(event.target.constraints)
        .toArray()
        .map(oldValues => {
          return {
            value: oldValues
          }
        });
      break;
  }
  return event;
}
