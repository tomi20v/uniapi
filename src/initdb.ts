import * as appConfigs from "../data/config/_appConfigs.json";
import * as entityConfigs from "../data/config/_entityConfigs.json";
import * as pluginConfigSchemas from "../data/config/_pluginConfigSchemas.json";
import * as entitySchemas from "../data/config/_entitySchemas.json";

import {
    appConfigRepository, entityConfigRepository, entitySchemaRepository,
    pluginConfigSchemaRepository
} from "./config/repositories";
import {PluginConfigSchema} from "./config/model/PluginConfigSchema";
import {EntityConfig} from "./config/model/EntityConfig";
import {EntitySchema} from "./config/model/EntitySchema";

const appConfigId = '$appConfig';

appConfigRepository.findById(appConfigId)
    .flatMap(each => each
        ? appConfigRepository.replace(appConfigId, appConfigs[0])
        : appConfigRepository.create(appConfigs[0])
    )
    .subscribe();

pluginConfigSchemaRepository.find({_id: {$regex: /^\$/}})
    .flatMap(eachFound => pluginConfigSchemaRepository.remove(eachFound.$id))
    .toArray()
    .flatMap(<any>pluginConfigSchemas)
    .flatMap((eachPluginSchema: PluginConfigSchema) => pluginConfigSchemaRepository
        .create(eachPluginSchema)    )
    .subscribe();

entityConfigRepository.find({_id: {$regex: /^\$/}})
    .flatMap(eachFound => entityConfigRepository.remove(eachFound._id))
    .toArray()
    .flatMap(<any>entityConfigs)
    .flatMap((eachEntityConfig: EntityConfig) => entityConfigRepository
        .create(eachEntityConfig))
    .subscribe();

entitySchemaRepository.find({_id:{$regex: /^\$/}})
    .flatMap(eachFound => entitySchemaRepository.remove(eachFound.$id))
    .toArray()
    .flatMap(<any>entitySchemas)
    .flatMap((eachSchema: EntitySchema) => entitySchemaRepository
        .create(eachSchema))
    .subscribe();

console.log('all done261');
