import {IPluginConfig} from "../../plugins/IPluginConfig";

export class AppConfig {

  constructor(
    public _id: string,
    public serverName: string,
    public version: number,
    public plugins: IPluginConfig[],
    public tstamp?: number|null,
    public crstamp?: number|null
  ) {}

  static fromDb(data: any) {
    return new AppConfig(
      data._id,
      data.serverName,
      data.version,
      data.plugins,
      data.tstamp || null,
      data.crstamp || null
    );
  }
}
