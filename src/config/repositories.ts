import {rxMongoDbStream} from "../db";
import {EntityRepository} from "./EntityRepository";
import {SchemaRepository} from "./SchemaRepository";
import {PluginRepository} from "./PluginRepository";

export const entityRepository = new EntityRepository(rxMongoDbStream);
export const schemaRepository = new SchemaRepository(rxMongoDbStream);
export const pluginRepository = new PluginRepository(rxMongoDbStream);
