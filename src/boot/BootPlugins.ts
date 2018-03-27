import {PluginManager} from "../plugins/PluginManager";
import {$TimestampPlugin} from "../plugins/corePlugins/$timestamp/$TimestampPlugin";
import {BootableInterface} from "./BootableInterface";
import {$TimestampInitDb} from "../plugins/corePlugins/$timestamp/$TimestampInitDb";
import {$RestPlugin} from "../plugins/corePlugins/$rest/$RestPlugin";
import {$RestInitDb} from "../plugins/corePlugins/$rest/$RestInitDb";

export class BootPlugins implements BootableInterface {

  constructor(
    private pluginManager: PluginManager
  ) {}

  boot(byInitDb: boolean = false) {
    console.log('booting internal plugins...');
    this.pluginManager.registerPlugin(
      '$rest',
      $RestPlugin,
      byInitDb ? new $RestInitDb() : null
    );
    console.log('...$rest plugin loaded');
    this.pluginManager.registerPlugin(
      '$timestamp',
      $TimestampPlugin,
      // don't even create if not initing db
      byInitDb ? new $TimestampInitDb() : null
    );
    console.log('...$timestamp plugin loaded');

  }

}
