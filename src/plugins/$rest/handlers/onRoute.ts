import {IEntityRequest, IEntityTarget} from "../../../entity/EntityRouter";
import {EntityError} from "../../../entity/EntityError";
import {IPluginEvent} from "../../IPluginEvent";

export function onRoute(
  event: IPluginEvent<IEntityTarget, IEntityRequest>
): IPluginEvent<IEntityTarget, IEntityRequest> {
  const pattern = /^\/([a-zA-Z][a-zA-Z\_0-9]*)(\/.+)?$/;
  const pattern2 = /^\/([a-zA-Z\_0-9]+)(\/.+)?$/;
  let entityResult = pattern.exec(event.value.pathParts);
  if (entityResult !== null) {
    event.value.entity = entityResult[1];
    event.value.pathParts = entityResult[2] || '';
    let idResult = pattern2.exec(event.value.pathParts);
    if (idResult !== null) {
      event.value.entityId = idResult[1];
      event.value.pathParts = idResult[2] || '';
    }
  }
  // @todo set event.value.data from incoming values based on request method
  let isEntityRequest = event.value.entityId !== null;
  switch (event.oldValue.method) {
    case 'GET':
      event.value.method = isEntityRequest
        ? this.config.getAction
        : this.config.getIndexAction;
      break;
    case 'POST':
      event.value.method = isEntityRequest
        ? this.config.postAction
        : this.config.postIndexAction;
      break;
    case 'PUT':
      event.value.method = isEntityRequest
        ? this.config.putAction
        : this.config.putIndexAction;
      break;
    case 'DELETE':
      event.value.method = isEntityRequest
        ? this.config.deleteAction
        : this.config.deleteIndexAction;
      break;
    case 'PATCH':
      if (!isEntityRequest) {
        throw new EntityError(405, 'patch not allowed on collections');
      }
      event.value.method = this.config.patchAction;
      break;
  }

  console.log('set entity and id: ', event.value.entity, event.value.entityId);
  return event;
}
