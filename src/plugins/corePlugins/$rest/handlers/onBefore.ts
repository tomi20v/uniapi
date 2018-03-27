import {$RestConfigActions} from "../$RestConfigInterface";
import {IPluginEvent2} from "../../../pluginEvent/IPluginEvents";

export function onBefore(
  event: IPluginEvent2
): IPluginEvent2 {
  switch (event.target.method) {
    case $RestConfigActions.replace:
    case $RestConfigActions.create:
    case $RestConfigActions.delete:
    case $RestConfigActions.update:
      if (!event.target.entityId.length) {
        throw 'target entity id missing';
      }
      event.oldValue$ = this.entityRepository(event.target.entity)
        // @TODO instead of plain findById I should build a query based on params previously set up in event.target.constraints
        .findById(event.target.entityId);
      break;
    case $RestConfigActions.replaceIndex:
    case $RestConfigActions.deleteIndex:
      event.oldValue$ = this.entityRepository(event.target.entity)
        // @TODO I have to use fetch params previously set up in event.target.constraints
        .find({});
      break;
  }
  return event;
}