import * as defaultConfig from '../../../config/server.json';
import {ServerConfigInterface} from "./ServerConfigInterface";
import {Observable} from "rxjs/Rx";
const _ = require('lodash');

export class ServerConfigManager {

  serverConfig$: Observable<ServerConfigInterface>;

  constructor(
    config: any
  ) {
    this.serverConfig$ = Observable.of(_.extend(
      {},
      defaultConfig,
      config
    ));
  }

}
