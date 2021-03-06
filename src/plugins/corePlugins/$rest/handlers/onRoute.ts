import {EntityError} from "../../../../entity/EntityError";
import {IPluginEntityEvent} from "../../../pluginEvent/IPluginEntityEvent";

export function onRoute(
  event: IPluginEntityEvent
): IPluginEntityEvent {
  const pattern = /^\/([a-zA-Z][a-zA-Z\_0-9]*)(\/.+)?$/;
  const pattern2 = /^\/([a-zA-Z\_0-9\$]+)(\/.+)?$/;
  let entityResult = pattern.exec(event.target.pathParts);
  if (entityResult !== null) {
    event.target.entityName = entityResult[1];
    event.target.pathParts = entityResult[2] || '';
    let idResult = pattern2.exec(event.target.pathParts);
    if (idResult !== null) {
      event.target.entityId = idResult[1];
      event.target.pathParts = idResult[2] || '';
    }
    const isEntityRequest = event.target.entityId !== null;
    let handled = true;
    // console.log('methods', event.request.method, event.target.method);
    if (isEntityRequest) {
      switch (event.request.method) {
        case 'GET':
          event.target.method = this.config.getAction;
          break;
        case 'POST':
          //event.target.method = this.config.postAction;
          handled = false;
          break;
        case 'PUT':
          event.target.method = this.config.putAction;
          break;
        case 'DELETE':
          event.target.method = this.config.deleteAction;
          break;
        case 'PATCH':
          event.target.method = this.config.patchAction;
          break;
        default:
          handled = false;
      }
    }
    else {
      switch (event.request.method) {
        case 'GET':
          event.target.method = this.config.getIndexAction;
          break;
        case 'POST':
          event.target.method = this.config.postIndexAction;
          break;
        case 'PUT':
          event.target.method = this.config.putIndexAction;
          break;
        case 'DELETE':
          event.target.method = this.config.deleteIndexAction;
          break;
        case 'PATCH':
          throw new EntityError(405, 'patch not allowed on collections');
        default:
          handled = false;
      }
    }
    if (handled) {
      // console.log('handled by $rest');
      // @todo cannot access statid :id
      event.target.handledBy = '$rest';
    }
  }

  console.log('set entity, id, method: ', event.target.entityName, event.target.entityId, event.target.method);
  return event;
}
