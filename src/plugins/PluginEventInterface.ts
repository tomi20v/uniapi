import {PluginConfigInterface} from "./PluginConfigInterface";

export interface PluginEventInterface {
    eventName: string;
    pluginConfig: PluginConfigInterface;
    value?: any;
    oldValue?: any;
}
