import {AppConfigRepository} from "../config/repository/AppConfigRepository";
import {AppConfig} from "../config/model/AppConfig";
import {Observable} from "rxjs/Rx";

export class AppConfigManager {

  appConfig: Observable<AppConfig>;

  constructor(
    private appConfigRepository: AppConfigRepository
  ) {
    this.init();
  }

  public init() {
    this.appConfig = <Observable<AppConfig>>this.appConfigRepository
      .findOne({_id: '$appConfig'})
      .catch(() => Observable.from([null]));
  }

}
