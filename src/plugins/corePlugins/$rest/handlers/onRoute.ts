import {EntityError} from "../../../../entity/EntityError";
import {IPluginEvent2} from "../../../pluginEvent/IPluginEvents";

export function onRoute(
  event: IPluginEvent2
): IPluginEvent2 {
  const pattern = /^\/([a-zA-Z][a-zA-Z\_0-9]*)(\/.+)?$/;
  const pattern2 = /^\/([a-zA-Z\_0-9\$]+)(\/.+)?$/;
  let entityResult = pattern.exec(event.target.pathParts);
  if (entityResult !== null) {
    event.target.entity = entityResult[1];
    event.target.pathParts = entityResult[2] || '';
    let idResult = pattern2.exec(event.target.pathParts);
    if (idResult !== null) {
      event.target.entityId = idResult[1];
      event.target.pathParts = idResult[2] || '';
    }
    const isEntityRequest = event.target.entityId !== null;
    let handled = true;
    if (isEntityRequest) {
      switch (event.target.method) {
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
      switch (event.target.method) {
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
      event.target.handledBy = this.id;
    }
  }

  console.log('set entity and id: ', event.target.entity, event.target.entityId);
  return event;
}
