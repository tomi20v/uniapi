import {IPluginConfig} from "../../IPluginConfig";

export enum $RestConfigActions {
  "disabled" = "disabled",
  "getIndex" = "getIndex",
  "replaceIndex" = "replaceIndex",
  "deleteIndex" = "deleteIndex",
  "get" = "get",
  "create" = "create",
  // note this could be a create if not exists
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
export enum $RestConfigUnknownFields {
  // no unknown fields
  "disabled" = "disabled",
  // unknown fields will be returned, but cannot be modified
  "read" = "read",
  // unknown fields will be saved, but never returned (not very useful)
  "write" = "write",
  // unknown fields can be written and read
  "enabled" = "enabled",
}
export enum $RestConfigPageSource {
  // .../:page
  "url" = "url",
  // .../page/:page
  "full" = "full",
  // ...?page=:page
  "param" = "param"
}

// @todo the commented config options have to be added to the config schema too
export interface $RestConfigInterface extends IPluginConfig {

  getIndexAction: $RestConfigActions;
  // @todo implement a very simple search by get params if enabled
  getIndexSearchEnabled: boolean;
  getIndexSearchableFields: string[];
  // @todo implement simple paging. 0 - disabled, -1 - from param
  // @todo or move to a general paging plugin?
  getIndexPageSize: number;
  getIndexPageSource: $RestConfigPageSource;
  postIndexAction: $RestConfigActions;
  putIndexAction: $RestConfigActions;
  deleteIndexAction: $RestConfigActions;
  // @todo implement a very simple search by get params if enabled
  deleteIndexSearchEnabled: boolean;
  deleteIndexSearchFields: string[];
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
  // @todo implement this
  onTrailingSlash: $RestConfigOnTrailingSlash;
  // @todo implement config switch for allowing unknown fields to be read/written
  unknownFields: $RestConfigUnknownFields;

}
