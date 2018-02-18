import {Router, Request, Response} from "express";
import {Rest} from "../share/Rest";
import {EntityConfig} from "./model/EntityConfig";
import * as merge from "merge";
import {RepositoryFactory} from "./RepositoryFactory";

export class ConfigRouter {

    constructor(
        private repositoryFactory: RepositoryFactory,
        public readonly router?: Router
    ) {
        this.router = router ? router : Router();
    }

    init() {

        this.router.get('/', (request: Request, response: Response) =>
            response.json({'hello':'bello'})
        );

        this.router
            .get('/entity/', (request: Request, response: Response) =>
                Rest.subscribeToOne(
                    this.repositoryFactory
                        .entityConfigRepository()
                        .find({})
                        .map(e => this.entityWithUri(e))
                        .toArray(),
                    response
                )
            )
            .post('/entity/', (request: Request, response: Response) =>
                // Rest.subscribeToOne(
                //     entityConfigRepository.create()
                // )
                response.json([request.param('name'), request.body])
            );

        this.router
            .get('/entity/:id', (request: Request, response: Response) =>
                Rest.subscribeToOne(
                    this.repositoryFactory
                        .entityConfigRepository()
                        .findOne({_id: request.params.id})
                        .map((e: EntityConfig) => this.entityWithUri(e)),
                    response
                )
            )
            .put('/entity/:id', (request: Request, response: Response) =>
                Rest.subscribeToOne(
                    this.repositoryFactory
                        .entityConfigRepository()
                        .replace(request.params.id, request.body),
                    response
                )
            );

        this.router
            .get('/schema/', (request: Request, response: Response) =>
                Rest.subscribeToOne(
                    this.repositoryFactory
                        .entitySchemaRepository()
                        .find({})
                        .toArray(),
                    response
                )
            );

        this.router
            .get('/schema/:id', (request: Request, response: Response) =>
                Rest.subscribeToOne(
                    this.repositoryFactory
                        .entitySchemaRepository()
                        .find({})
                        .toArray(),
                    response
                )
            );

        this.router
            .get('/plugin/', (request: Request, response: Response) =>
                Rest.subscribeToOne(
                    this.repositoryFactory
                        .pluginConfigSchemaRepository()
                        .find({})
                        .toArray(),
                    response
                )
            );

        this.router
            .get('/plugin/:id', (request: Request, response: Response) =>
                Rest.subscribeToOne(
                    this.repositoryFactory
                        .pluginConfigSchemaRepository()
                        .findById(request.params.id),
                    response
                )
            );

        this.router
            .get('/schema/:id', (request: Request, response: Response) =>
                Rest.subscribeToOne(
                    this.repositoryFactory
                        .entitySchemaRepository()
                        .findById(request.params.id),
                    response
                )
            );

    }

    /** @todo this should be a plugin */
    private entityWithUri(entity: EntityConfig) {
        return merge({}, entity, {_uri: '/entity/' + entity._id});
    }

}
// const router: Router = Router();
// function entityWithUri(entity: EntityConfig) {
//     return merge({}, entity, {_uri: '/entity/' + entity._id});
// }
// router.get('/', (request: Request, response: Response) =>
//     response.json({'hello':'bello'})
// );
//
// router
//     .get('/entity/', (request: Request, response: Response) =>
//         Rest.subscribeToOne(
//             entityConfigRepository
//                 .find({})
//                 .map(e => entityWithUri(e))
//                 .toArray(),
//             response
//         )
//     )
//     .post('/entity/', (request: Request, response: Response) =>
//         // Rest.subscribeToOne(
//         //     entityConfigRepository.create()
//         // )
//         response.json([request.param('name'), request.body])
//     );
//
// router
//     .get('/entity/:id', (request: Request, response: Response) =>
//         Rest.subscribeToOne(
//             entityConfigRepository
//                 .findOne({_id: request.params.id})
//                 .map((e: EntityConfig) => entityWithUri(e)),
//             response
//         )
//     )
//     .put('/entity/:id', (request: Request, response: Response) =>
//         Rest.subscribeToOne(
//             entityConfigRepository.replace(request.params.id, request.body),
//             response
//         )
//     );
//
// router
//     .get('/schema/', (request: Request, response: Response) =>
//         Rest.subscribeToOne(
//             entitySchemaRepository.find({}).toArray(),
//             response
//         )
//     );
//
// router
//     .get('/schema/:id', (request: Request, response: Response) =>
//         Rest.subscribeToOne(
//             entitySchemaRepository.find({}).toArray(),
//             response
//         )
//     );
//
// router
//     .get('/plugin/', (request: Request, response: Response) =>
//         Rest.subscribeToOne(
//             pluginConfigSchemaRepository
//                 .find({})
//                 .toArray(),
//             response
//         )
//     );
//
// router
//     .get('/plugin/:id', (request: Request, response: Response) =>
//         Rest.subscribeToOne(
//             pluginConfigSchemaRepository
//                 .findById(request.params.id),
//             response
//         )
//     );
//
// router
//     .get('/schema/:id', (request: Request, response: Response) =>
//         Rest.subscribeToOne(
//             entitySchemaRepository
//                 .findById(request.params.id),
//             response
//         )
//     );
//
