import {$RestConfigActions} from "../$RestConfigInterface";
import {IPluginEvent2} from "../../../pluginEvent/IPluginEvents";
const _ = require('lodash');

export function onExecute(
  event: IPluginEvent2
): IPluginEvent2 {
  if (event.target.handledBy !== this.id) {
    return event;
  }
  switch (event.target.method) {
    case $RestConfigActions.get:
      event.target.result$ = event.target.result$
        .flatMap(result => event.oldValue$
          .toArray()
          .catch(() => [[]])
          .map(oldValueArr => _.extend(
            {},
            result,
            { data: (oldValueArr[0] || [])[0] || null }
          ))
        );
      break;
    case $RestConfigActions.getIndex:
      event.target.result$ = event.target.result$
        .flatMap(result => event.oldValue$
          .toArray()
          .catch(() => [[]])
          .map(resultsArr => _.extend(
            {},
            result,
            { data: resultsArr[0] || [] }
          ))
        );
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
