import {IPluginEvent2} from "../../../pluginEvent/IPluginEvents";
import {$RestConfigActions} from "../$RestConfigInterface";
import {IPluginErrors} from "../../../plugin/IPluginErrors";
import {isArray} from "util";

export function onPostroute(
  event: IPluginEvent2
): IPluginEvent2 {

  // we MUST have entity here indeed, but just in case...
  if (!event.target.entity || (event.target.handledBy !== this.id)) {
    return event;
  }
  if (!event.target.entityConfig) {
    throw '@todo no entityconfig for ' + event.target.entity + ' in $restPlugin onPostroute';
  }

  const isEntityRequest = event.target.entityId !== null;
  let handled = true;

  const idField = '_id';

  // @todo should I filter incoming data here??? eg. no unknown fields in updates

  if (isEntityRequest) {
    switch (event.target.method) {
      case $RestConfigActions.get:
        event.target.data = event.request.params;
        event.target.constraints[idField] = event.target.entityId;
        // this would be a search which also should go to the collection
        //  resource not the entity
        // Object.keys(event.target.data).forEach(eachKey =>
        //   event.target.constraints[eachKey] = event.target.data[eachKey]);
        break;
      // note this can be a create
      case $RestConfigActions.replace:
      case $RestConfigActions.update:
        // @todo do I need a json decode?
        event.target.data = event.request.body;
        event.target.constraints[idField] = event.target.entityId;
        break;
      case $RestConfigActions.delete:
        event.target.constraints[idField] = event.target.entityId;
        break;
      default:
        handled = false;
    }
    console.log('set data for ' + event.target.method, event.target.data);
    console.log('set constraints for ' + event.target.method, event.target.constraints);
  }
  else {
    switch (event.target.method) {
      case $RestConfigActions.getIndex:
        event.target.data = event.request.params;
        if (this.config.getIndexSearchEnabled) {
          setConstraintsFromParams(event, this.config.getIndexSearchableFields);
        }
        break;
      case $RestConfigActions.replaceIndex:
        event.target.data = event.request.body;
        if (!isArray(event.target.data)) {
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
        event.target.data = event.request.params;
        if (this.config.deleteIndexSearchEnabled) {
          setConstraintsFromParams(event, this.config.deleteIndexSearchFields);
        }
        break;
      default:
        handled = false;
    }
    console.log('set data for ' + event.target.method, event.target.data);
    console.log('set constraints for ' + event.target.method, event.target.constraints);
  }

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
    event.target.entity,
    event.target.entityId,
    event.target.handledBy,
    event.target.data
  );

  return event;

}
