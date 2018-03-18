import {IPluginEvent} from "../../IPluginEvent";
import {IEntityTarget} from "../../../entity/EntityRouter";
import {$RestConfigActions} from "../$RestConfigInterface";

export function onExecute(
  event: IPluginEvent<IEntityTarget, IEntityTarget>
): IPluginEvent<IEntityTarget, IEntityTarget> {
  switch (event.value.method) {
    case $RestConfigActions.get:
      event.value.data$ = this.entityRepository(event.value.entity)
        .findById(event.value.entityId);
      break;
    case $RestConfigActions.getIndex:
      event.value.data$ = this.entityRepository(event.value.entity)
        .find({})
        .toArray();
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
