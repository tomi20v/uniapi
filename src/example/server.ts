import {Server} from "../server/Server";
import {ServerConfigInterface} from "../server/ServerConfigInterface";

const server = new Server(<ServerConfigInterface>{});
server.start();
