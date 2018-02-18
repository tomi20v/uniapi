import {InitDbData} from "./InitDbDataInterface";
import {CallableInterface} from "../share/CallableInterface";

export interface PluginInitDbInterface {

    initDb(data: InitDbData, logger?: CallableInterface<any>): InitDbData;

}
