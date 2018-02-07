import {Context} from "./Context";

export interface PluginEventInterface {
    eventName: string;
    value?: any;
    oldValue?: any;
    context?: Context;
}
