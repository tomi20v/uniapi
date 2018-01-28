import {RepositoryAbstract} from "../share/repositoryAbstract";
import {CallableInterface} from "../share/callableInterface";
import {Plugin} from "../model/Plugin";
import {Observable} from "rxjs/Rx";

export class PluginRepository extends RepositoryAbstract {

    mongoCollectionName: string = 'ua_plugin';

    factory: CallableInterface<any> = Plugin.fromDb;

    create(plugin: Plugin) {
        return this._create(plugin);
    }

    findById(id: string): Observable<any> {
        return this.findOne({_id: id});
    }

}
