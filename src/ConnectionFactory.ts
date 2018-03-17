import {ServerConfigInterface} from "./server/ServerConfigInterface";
import {ServerConfigManager} from "./server/ServerConfigManager";
import {ReplaySubject} from "rxjs/Rx";
import {ILogger} from "./share/ILogger";
const MongoClient = require('mongodb').MongoClient;

export class ConnectionFactory {

  connection = new ReplaySubject<any>();

  constructor(
    private serverConfigManager: ServerConfigManager,
    private logger?: ILogger
  ) {
    this.serverConfigManager.serverConfig
      .subscribe(
        (config: ServerConfigInterface) => {
          const dsn = config.storage.dsn;
          MongoClient.connect(dsn, (err, db) => {
            if (err) {
              this.connection.error('couldn`t connect to mongo');
            }
            else {
              this.connection.next(db);
              this.connection.complete();
            }
          });
        }
      );
    if (this.logger) {
      this.connection.subscribe(
        () => this.logger('...Mongodb connected'),
        e => this.logger('(!)Mongodb connection ERROR', e)
      )
    }
  }

}
