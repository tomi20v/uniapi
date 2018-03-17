import {Observable} from "rxjs/Rx";
import {CallableInterface} from "./CallableInterface";

const _ = require('lodash');

export class TaskRunner {

  private taskCnt: number = 0;
  private subscriptions = [];

  constructor(
    private tasks: any,
    private onComplete: CallableInterface<any> = () => null,
    private logger: CallableInterface<any> = () => null
  ) {
    _.forEach(tasks, () => this.taskCnt++);
  }

  run() {
    _.forEach(this.tasks, (task, key) => this.subscribeTo(key, task));
  }

  private subscribeTo(
    coll: string,
    stream: Observable<any>
  ) {
    let s = stream
      .subscribe(
        null,
        (e) => this.logger('...' + coll + ' ERROR', e),
        () => {
          this.logger('...' + coll + ' OK');
          this.unsubscribeAndExit(s);
        }
      );
    this.subscriptions.push(s);
    return s;
  }

  private unsubscribeAndExit(subscription) {
    subscription.unsubscribe();
    if ((this.subscriptions.length == this.taskCnt) &&
      !_.filter(this.subscriptions, eachSubscription =>
        !eachSubscription.isStopped
      ).length
    ) {
      this.logger('ALL DONE');
      this.onComplete();
    }
  }

}
