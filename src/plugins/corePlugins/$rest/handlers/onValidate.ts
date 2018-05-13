import {$RestConfigActions} from "../$RestConfigInterface";
import {IPluginEntityEvent} from "../../../pluginEvent/IPluginEntityEvent";

export function onValidate(
  event: IPluginEntityEvent
): IPluginEntityEvent {
  if (event.target.handledBy !== this.id) {
    return event;
  }
  switch (event.target.method) {
    case $RestConfigActions.getIndex:
    case $RestConfigActions.replaceIndex:
    case $RestConfigActions.deleteIndex:
      break;
    case $RestConfigActions.create:
      // I should throw here if ID is sent and exists
      // @todo I need entityrepositry here
      // event.target.result$ = event.target.result$
      //   .flatMap(result => {
      //     if (event.target.data._id) {
      //       return this.entityRepository
      //     }
      //   })
      break;
    case $RestConfigActions.get:
      break;
    case $RestConfigActions.replace:
    case $RestConfigActions.update:
    case $RestConfigActions.delete:
      // I should throw here if previous not found
      break;
  }
  return event;
}
