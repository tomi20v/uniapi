import {PluginEventInterface} from "./PluginEventInterface";
import {PluginConfigInterface} from "./PluginConfigInterface";

export interface PluginInterface {

    handle(
        event: PluginEventInterface,
        config: PluginConfigInterface
    ): boolean;

}
