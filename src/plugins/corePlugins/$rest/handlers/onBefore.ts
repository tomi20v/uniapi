import {$RestConfigActions} from "../$RestConfigInterface";
import {IEntityValue, IPluginEntityEvent} from "../../../pluginEvent/IPluginEntityEvent";
import {Observable} from "rxjs/Rx";

export function onBefore(
  event: IPluginEntityEvent
): IPluginEntityEvent {
  if (event.target.handledBy !== this.id) {
    return event;
  }
  switch (event.target.method) {
    case $RestConfigActions.getIndex:
      break;
    case $RestConfigActions.replaceIndex:
      // event.target.targetValue$ = event.target.oldValue$
      //   .map((oldValue: IEntityValue) => {
      //     console.log('onbefore ', oldValue);
      //     return oldValue.value
      //   });
      break;
    case $RestConfigActions.deleteIndex:
      break;
    case $RestConfigActions.create:
      event.target.targetValue$ = Observable.from([event.target.inData]);
      break;
    case $RestConfigActions.get:
      break;
    case $RestConfigActions.replace:
      event.target.targetValue$ = Observable.from([event.target.inData]);
      break;
    case $RestConfigActions.update:
      event.target.targetValue$ = event.target.oldValue$
        .map((oldValue: IEntityValue) => oldValue.value);
      break;
    case $RestConfigActions.delete:
      break;
  }
  return event;
}
