import {AInitDb} from "../../initDb/AInitDb";
import {PluginConfigSchema} from "../../../config/model/PluginConfigSchema";
import {
  $RestConfigActions,
  $RestConfigInterface,
  $RestConfigOnTrailingSlash,
  $RestConfigPageSource, $RestConfigUnknownFields
} from "./$RestConfigInterface";

export class $RestInitDb extends AInitDb {

  protected configSchema: PluginConfigSchema = {
    "$id": "$rest",
    "definitions": {
      "actions": {
        "enum": [
          "disabled",
          "index",
          "get",
          "create",
          "update",
          "replace"
        ]
      },
      "onTrailingSlash": {
        "enum": [
          "disabled",
          "redirect",
          "accept"
        ]
      }
    },
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "title": "rest core plugin",
    "properties": {
      "pluginId": {
        "type": "string",
        "enum": ["$rest"],
        "title": "Plugin ID",
        "default": "$rest"
      },
      "description": {
        "type": "string",
        "title": "Description",
        "description": "Can add description about what this plugin does. Eg. when the same plugin is used more than once"
      },
      "getIndexAction": {
        "$ref": "#/definitions/actions",
        "type": "string",
        "title": "action on entity/ path GET request",
        "default": "getIndex"
      },
      "postIndexAction": {
        "$ref": "#/definitions/actions",
        "type": "string",
        "title": "action on entity/ path POST request",
        "default": "create"
      },
      "putIndexAction": {
        "$ref": "#/definitions/actions",
        "type": "string",
        "title": "action on entity/ path PUT request",
        "default": "replaceIndex"
      },
      "deleteIndexAction": {
        "$ref": "#/definitions/actions",
        "type": "string",
        "title": "action on entity/ path DELETE request",
        "default": "deleteIndex"
      },
      "getAction": {
        "$ref": "#/definitions/actions",
        "type": "string",
        "title": "action on entity/id path GET request",
        "default": "get"
      },
      "putAction": {
        "$ref": "#/definitions/actions",
        "type": "string",
        "title": "action on entity/id path PUT request",
        "default": "replace"
      },
      "postAction": {
        "$ref": "#/definitions/actions",
        "type": "string",
        "title": "action on entity/id path POST request",
        "default": "disabled"
      },
      "patchAction": {
        "$ref": "#/definitions/actions",
        "type": "string",
        "title": "action on entity/id path PATCH request",
        "default": "update"
      },
      "deleteAction": {
        "$ref": "#/definitions/actions",
        "type": "string",
        "title": "action on entity/id path DELETE request",
        "default": "delete"
      },
      "onTrailingSlash": {
        "type": "string",
        "title": "How to treat requests with trailing slash",
        "description": "options are: disabled|redirect|accept|require\n  disabled - will return 404 on trailing slash requests\n  remove - will redirect to url WITHOUT trailing slash if present\n  add - will redirect to url WITH trailing slash if none\n  accept - will accept urls both with or without trailing slash\n  require - only urls with trailing slash will be accepted",
        "default": "require"
      }
    },
    "required": [
      "pluginId",
      "description",
      "getIndexAction",
      "postIndexAction",
      "putIndexAction",
      "deleteIndexAction",
      "getAction",
      "putAction",
      "postAction",
      "patchAction",
      "deleteAction",
      "onTrailingSlash"
    ]
  };

  protected defaultAppConfigs: $RestConfigInterface[] = [
    {
      pluginId: "$rest",
      description: "",
      enabled: true,
      getIndexAction: $RestConfigActions.getIndex,
      getIndexSearchEnabled: false,
      getIndexSearchableFields: [],
      getIndexPageSize: 0,
      getIndexPageSource: $RestConfigPageSource.full,
      postIndexAction: $RestConfigActions.create,
      putIndexAction: $RestConfigActions.replaceIndex,
      deleteIndexAction: $RestConfigActions.deleteIndex,
      deleteIndexSearchEnabled: false,
      deleteIndexSearchFields: [],
      getAction: $RestConfigActions.get,
      postAction: $RestConfigActions.disabled,
      putAction: $RestConfigActions.replace,
      patchAction: $RestConfigActions.update,
      deleteAction: $RestConfigActions.delete,
      onTrailingSlash: $RestConfigOnTrailingSlash.add,
      unknownFields: $RestConfigUnknownFields.disabled,
    }
  ];

}
