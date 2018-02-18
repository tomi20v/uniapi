import {PluginEventInterface} from "./PluginEventInterface";
import {PluginConfigInterface} from "./PluginConfigInterface";
import {PluginConfigSchema} from "../config/model/PluginConfigSchema";

export interface PluginInterface {

    readonly id: string;

    handle(
        event: PluginEventInterface,
        config: PluginConfigInterface
    ): boolean;

}
