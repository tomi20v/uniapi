import {PluginManager} from "../plugins/PluginManager";
import {$TimestampPlugin} from "../plugins/$timestamp/$TimestampPlugin";
import {BootableInterface} from "./BootableInterface";
import {$TimestampInitDb} from "../plugins/$timestamp/$TimestampInitDb";

export class BootPlugins implements BootableInterface {

  constructor(
    private pluginManager: PluginManager
  ) {}

  boot(byInitDb: boolean = false) {
    console.log('booting internal plugins...');
    this.pluginManager.registerPlugin(
      '$timestamp',
      $TimestampPlugin,
      // don't even create if not initing db
      byInitDb ? new $TimestampInitDb() : null
    );
    console.log('...$timestamp plugin loaded');

  }

}
