import {PluginEventInterface} from "./PluginEventInterface";
import {CallableInterface} from "../share/CallableInterface";

export interface IPluginHandlerDefinition {
    pattern: RegExp;
    callback: CallableInterface<PluginEventInterface>;
}

export interface PluginInterface {

    readonly id: string;

    readonly handlers: IPluginHandlerDefinition[];

    // handle(
    //     event: PluginEventInterface,
    //     config: PluginConfigInterface
    // ): PluginEventInterface;

}
