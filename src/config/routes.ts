import {Router, Request, Response} from "express";
import {Rest} from "../share/Rest";
import {entityConfigRepository, pluginConfigSchemaRepository, entitySchemaRepository} from "./repositories";
import {EntityConfig} from "./model/EntityConfig";
import * as merge from "merge";

const configRouter: Router = Router();

/**
 * @todo this should be a plugin
 */
function entityWithUri(entity: EntityConfig) {
    return merge({}, entity, {_uri: '/entity/' + entity._id});
}

configRouter.get('/', (request: Request, response: Response) =>
    response.json({'hello':'bello'})
);

configRouter
    .get('/entity/', (request: Request, response: Response) =>
        Rest.subscribeToOne(
            entityConfigRepository
                .find({})
                .map(e => entityWithUri(e))
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

configRouter
    .get('/entity/:id', (request: Request, response: Response) =>
        Rest.subscribeToOne(
            entityConfigRepository
                .findOne({_id: request.params.id})
                .map((e: EntityConfig) => entityWithUri(e)),
            response
        )
    )
    .put('/entity/:id', (request: Request, response: Response) =>
        Rest.subscribeToOne(
            entityConfigRepository.replace(request.params.id, request.body),
            response
        )
    );

configRouter
    .get('/schema/', (request: Request, response: Response) =>
        Rest.subscribeToOne(
            entitySchemaRepository.find({}).toArray(),
            response
        )
    );

configRouter
    .get('/schema/:id', (request: Request, response: Response) =>
        Rest.subscribeToOne(
            entitySchemaRepository.find({}).toArray(),
            response
        )
    );

configRouter
    .get('/plugin/', (request: Request, response: Response) =>
        Rest.subscribeToOne(
            pluginConfigSchemaRepository
                .find({})
                .toArray(),
            response
        )
    );

configRouter
    .get('/plugin/:id', (request: Request, response: Response) =>
        Rest.subscribeToOne(
            pluginConfigSchemaRepository
                .findById(request.params.id),
            response
        )
    );

configRouter
    .get('/schema/:id', (request: Request, response: Response) =>
        Rest.subscribeToOne(
            entitySchemaRepository
                .findById(request.params.id),
            response
        )
    );

export {configRouter}
