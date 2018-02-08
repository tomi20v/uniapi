import {rxMongoDbStream} from "../db";
import {EntityConfigRepository} from "./EntityConfigRepository";
import {SchemaRepository} from "./SchemaRepository";
import {PluginConfigSchemaRepository} from "./PluginConfigSchemaRepository";
import {AppConfigRepository} from "./AppConfigRepository";
import {FieldNameCleaner} from "../share/FieldNameCleaner";


// @TODO move these to a factory
const fieldNameCleaner = new FieldNameCleaner();

export const entityConfigRepository = new EntityConfigRepository(rxMongoDbStream, fieldNameCleaner);
export const entitySchemaRepository = new SchemaRepository(rxMongoDbStream, fieldNameCleaner);
export const pluginConfigSchemaRepository = new PluginConfigSchemaRepository(rxMongoDbStream, fieldNameCleaner);
export const appConfigRepository = new AppConfigRepository(rxMongoDbStream, fieldNameCleaner);
