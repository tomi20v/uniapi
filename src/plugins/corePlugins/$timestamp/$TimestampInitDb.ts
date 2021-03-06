import {PluginConfigSchema} from "../../../config/model/PluginConfigSchema";
import {AInitDb} from "../../initDb/AInitDb";
import {$TimestampConfigInterface} from "./$TimestampConfigInterface";

export class $TimestampInitDb extends AInitDb {

  protected configSchema: PluginConfigSchema = {
    "$id": "$timestamp",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "title": "schema for the $timestamp plugin",
    "properties": {
      "pluginId": {
        "$id": "/properties/pluginId",
        "type": "string",
        "enum": [
          "$timestamp"
        ],
        "title": "Plugin ID",
        "default": "$timestamp"
      },
      "description": {
        "$id": "/properties/description",
        "type": "string",
        "title": "Description",
        "description": "Can add description about what this plugin does. Eg. when the same plugin is used more than once"
      },
      "onCreate": {
        "$id": "/properties/onCreate",
        "type": "boolean",
        "title": "Stamp on create",
        "default": true
      },
      "onCreateField": {
        "$id": "/properties/onCreateField",
        "type": "string",
        "title": "Field to put stamp on create",
        "default": "crstamp"
      },
      "onUpdate": {
        "$id": "/properties/onUpdate",
        "type": "boolean",
        "title": "Stamp on update",
        "default": true
      },
      "onUpdateField": {
        "$id": "/properties/onUpdateField",
        "type": "string",
        "title": "Field to put stamp on update",
        "default": "tstamp"
      },
      "format": {
        "$id": "/properties/format",
        "type": "string",
        "enum": [
          "timestamp"
        ],
        "title": "Format",
        "description": "Currently only unix timestamp is supported",
        "default": "timestamp"
      }
    },
    "required": [
      "pluginId",
      "description",
      "onCreate",
      "onCreateField",
      "onUpdate",
      "onUpdateField",
      "format"
    ]
  };

  protected defaultAppConfigs: $TimestampConfigInterface[] = [
    {
      "pluginId": "$timestamp",
      "enabled": true,
      "description": "server level timestamping",
      "onCreate": true,
      "onCreateField": "crStamp",
      "onUpdate": true,
      "onUpdateField": "tStamp",
      "format": "timestamp"
    }
  ];

}
