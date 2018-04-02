import * as http from 'http';
import * as express from "express";
import {BootableInterface} from "../boot/BootableInterface";
import {UniApiApp} from "../UniApiApp";

export class Server {

  private server: http.Server;

  constructor(
    private uniApiApp: UniApiApp,
    private bootPlugins: BootableInterface
  ) {}

  start() {

    this.bootPlugins.boot();

    this.uniApiApp.init()
      .subscribe(
        (expressApp: express.Application) => {
          this.server = http.createServer(expressApp);
          const port = expressApp.get('port');
          this.server.listen(port);
          console.log('listening on ' + port);
        }
      )
  }

}
