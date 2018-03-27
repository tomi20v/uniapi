import {IPluginConfig} from "../../IPluginConfig";

export interface $TimestampConfigInterface extends IPluginConfig {

  onCreate: boolean;
  onCreateField: string;
  onUpdate: boolean;
  onUpdateField: string;
  /** @var format string [timestamp] (more options to be added */
  format: string;

}
