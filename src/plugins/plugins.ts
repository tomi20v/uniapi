import {PluginManager} from "./PluginManager";
import {pluginRepository} from "../config/repositories";
import {$TimestampPlugin} from "./$timestamp/$TimestampPlugin";
import {AbstractSchema} from "../model/AbstractSchema";

export const pluginManager = new PluginManager();

// register built-in plugins
pluginRepository.find({_$id: $TimestampPlugin.id}).subscribe((schema: AbstractSchema) => {
    pluginManager.registerPlugin(new $TimestampPlugin(), schema);
});

console.log("plugins loaded");
