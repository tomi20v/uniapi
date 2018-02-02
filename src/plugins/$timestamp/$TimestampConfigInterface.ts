import {PluginConfigInterface} from "../PluginConfigInterface";

export interface $TimestampConfigInterface extends PluginConfigInterface {

    onCreate: boolean;
    onCreateField: string;
    onUpdate: boolean;
    onUpdateField: string;
    /** @var format string [timestamp] (more options to be added */
    format: string;

}
