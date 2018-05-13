import {IPluginEntityEvent} from "../../../pluginEvent/IPluginEntityEvent";
import {$RestConfigActions} from "../$RestConfigInterface";
import {IPluginErrors} from "../../../plugin/IPluginErrors";
import {isArray} from "util";

export function onPostroute(
  event: IPluginEntityEvent
): IPluginEntityEvent {

  // we MUST have entity here indeed, but just in case...
  if (!event.target.entityName || (event.target.handledBy !== this.id)) {
    return event;
  }
  if (!event.target.entityConfig) {
    throw '@todo no entityconfig for ' + event.target.entityName + ' in $restPlugin onPostroute';
  }

  const isEntityRequest = event.target.entityId !== null;
  let handled = true;

  // this is fixed to be _id - known limitation
  const idField = '_id';

  // @todo should I filter incoming data here??? eg. no unknown fields in updates
  // @NO, those should be found in the validation

  // if (isEntityRequest) {
    switch (event.target.method) {
      case $RestConfigActions.get:
        event.target.inData = event.request.params;
        event.target.constraints[idField] = event.target.entityId;
        break;
      // note this can be a create
      case $RestConfigActions.replace:
      case $RestConfigActions.update:
        // @todo do I need a json decode?
        event.target.inData = event.request.body;
        event.target.constraints[idField] = event.target.entityId;
        break;
      case $RestConfigActions.delete:
        event.target.constraints[idField] = event.target.entityId;
        break;
  //     default:
  //       handled = false;
  //   }
  //   console.log('set data for ' + event.target.method, event.target.inData);
  //   console.log('set constraints for ' + event.target.method, event.target.constraints);
  // }
  // else {
  //   switch (event.target.method) {
      case $RestConfigActions.getIndex:
        event.target.inData = event.request.params;
        if (this.config.getIndexSearchEnabled) {
          setConstraintsFromParams(event, this.config.getIndexSearchableFields);
        }
        break;
      case $RestConfigActions.replaceIndex:
        event.target.inData = event.request.body;
        if (!isArray(event.target.inData)) {
          throw <IPluginErrors> {
            errors: [
              {
                fatal: true,
                error: 'data not array',
                field: '/'
              }
            ]
          }
        }
        break;
      case $RestConfigActions.deleteIndex:
        event.target.inData = event.request.params;
        if (this.config.deleteIndexSearchEnabled) {
          setConstraintsFromParams(event, this.config.deleteIndexSearchFields);
        }
        break;
      case $RestConfigActions.create:
        event.target.inData = event.request.body;
        break;
      default:
        handled = false;
    }
    console.log('set data for ' + event.target.method, event.target.inData);
    console.log('set constraints for ' + event.target.method, event.target.constraints);
  // }

  function setConstraintsFromParams(event, searchableFields) {
    Object.keys(event.target.data).forEach(eachKey => {
      if (!searchableFields.length ||
        (searchableFields.length &&
          (searchableFields.length.indexOf(eachKey) !== -1))
      ) {
        event.target.constraints[eachKey] = event.target.data[eachKey];
      }
    });
  }

  if (!handled) {
    console.log('$rest did not handle');
    event.target.handledBy = null;
  }

  console.log(
    'fetched request data for: ',
    event.target.entityName,
    event.target.entityId,
    event.target.handledBy,
    event.target.inData
  );

  return event;

}
