import {IEntityTarget} from "../../../entity/EntityRouter";
import {IPluginEvent} from "../../IPluginEvent";
import {$RestConfigActions} from "../$RestConfigInterface";

export function onBefore(
  event: IPluginEvent<IEntityTarget, IEntityTarget>
): IPluginEvent<IEntityTarget, IEntityTarget> {
  switch (event.value.method) {
    case $RestConfigActions.replace:
    case $RestConfigActions.create:
    case $RestConfigActions.delete:
    case $RestConfigActions.update:
      if (!event.value.entityId.length) {
        throw 'target entity id missing';
      }
      event.oldValue.data$ = this.entityRepository(event.value.entity)
        .findById(event.value.entityId);
      break;
    case $RestConfigActions.replaceIndex:
    case $RestConfigActions.deleteIndex:
      event.oldValue.data$ = this.entityRepository(event.value.entity)
      // I might want to fetch filtering params here?
        .find({});
      break;
  }
  return event;
}
