import {rxMongoDbStream} from "../db";
import {EntityConfigRepository} from "./EntityConfigRepository";
import {SchemaRepository} from "./SchemaRepository";
import {PluginConfigSchemaRepository} from "./PluginConfigSchemaRepository";
import {AppConfigRepository} from "./AppConfigRepository";

export const entityConfigRepository = new EntityConfigRepository(rxMongoDbStream);
export const entitySchemaRepository = new SchemaRepository(rxMongoDbStream);
export const pluginConfigSchemaRepository = new PluginConfigSchemaRepository(rxMongoDbStream);
export const appConfigRepository = new AppConfigRepository(rxMongoDbStream);
