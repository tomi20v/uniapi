import {BootPlugins} from "../../src/boot/BootPlugins";

export class BootPluginsLocal extends BootPlugins{
    // this is now just a placeholder for a generated plugin booter
    boot(byInitDb: boolean = false) {
        super.boot(byInitDb);
        // do stuff here by this.register()
    }
}
