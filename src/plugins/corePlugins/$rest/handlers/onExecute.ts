import {$RestConfigActions} from "../$RestConfigInterface";
import {IEntityValue, IPluginEntityEvent} from "../../../pluginEvent/IPluginEntityEvent";
import {IPluginErrors} from "../../../plugin/IPluginErrors";
const _ = require('lodash');

export function onExecute(
  event: IPluginEntityEvent
): IPluginEntityEvent {
  if (event.target.handledBy !== this.id) {
    return event;
  }
  switch (event.target.method) {
    case $RestConfigActions.getIndex:
      event.result$ = event.result$
        .flatMap(result => event.target.oldValue$
          .map((resultsArr: IEntityValue) => _.extend(
            {},
            result,
            { data: resultsArr.value[0] || [] }
          ))
        );
      break;
    case $RestConfigActions.replaceIndex:
      break;
    case $RestConfigActions.deleteIndex:
      break;
    case $RestConfigActions.create:
      let othis = this;
      event.result$ = event.result$
        .flatMap(result => event.target.targetValue$
          // .flatMap(othis.entityRepository(event.target.entityName).create$)
          .flatMap(targetValue => this.entityRepository(event.target.entityName)
            .create$(targetValue))
          .map((insertResult: any) => {
            if (!insertResult.result || !insertResult.result.ok || !insertResult.insertedCount) {
              throw <IPluginErrors> {
                errors: [
                  {
                    fatal: true,
                    error: 'create (insert) falied',
                  }
                ]
              }
            }
            return _.extend(
              {},
              result,
              { data: insertResult.ops[0] }
            )
          })
        );
      break;
    case $RestConfigActions.get:
      event.result$ = event.result$
        .flatMap(result => event.target.oldValue$
          .map((oldValueArr: IEntityValue) => _.extend(
            {},
            result,
            { data: oldValueArr.value[0]  || null }
          ))
        );
      break;
    case $RestConfigActions.replace:
      break;
    case $RestConfigActions.update:
      break;
    case $RestConfigActions.delete:
      break;
  }
  return event;
}
