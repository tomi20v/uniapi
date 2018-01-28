import {Entity} from "../model/Entity";
import {RepositoryAbstract} from "../share/repositoryAbstract";
import {CallableInterface} from "../share/callableInterface";

export class EntityRepository extends RepositoryAbstract {

    mongoCollectionName: string = 'ua_entity';

    factory: CallableInterface<any> = Entity.fromDb;

    create(entity: Entity) {
        return this._create(entity);
    }

}
