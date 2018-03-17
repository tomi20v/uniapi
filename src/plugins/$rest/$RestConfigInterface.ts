import {PluginConfigInterface} from "../PluginConfigInterface";

export enum $RestConfigActions {
  "disabled" = "disabled",
  "getIndex" = "getIndex",
  "replaceIndex" = "replaceIndex",
  "deleteIndex" = "deleteIndex",
  "get" = "get",
  "create" = "create",
  "replace" = "replace",
  "update" = "update",
  "delete" = "delete",
}
export enum $RestConfigOnTrailingSlash {
  "disabled" = "disabled",
  "remove" = "remove",
  "add" = "add",
  "accept" = "accept",
  "require" = "require",
}

export interface $RestConfigInterface extends PluginConfigInterface {

  getIndexAction: $RestConfigActions;
  postIndexAction: $RestConfigActions;
  putIndexAction: $RestConfigActions;
  deleteIndexAction: $RestConfigActions;
  getAction: $RestConfigActions;
  putAction: $RestConfigActions;
  postAction: $RestConfigActions;
  patchAction: $RestConfigActions;
  deleteAction: $RestConfigActions;
  // @todo allow property level CRUD by direct url addressing. planned
  // getPropertyAction: $RestConfigActions;
  // putPropertyAction: $RestConfigActions;
  // postPropertyAction: $RestConfigActions;
  // patchPropertyAction: $RestConfigActions;
  // deletePropertyAction: $RestConfigActions;
  onTrailingSlash: $RestConfigOnTrailingSlash;

}
