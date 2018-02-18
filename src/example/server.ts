import {ServerConfigInterface} from "../server/ServerConfigInterface";
import {ServerFactory} from "../server/ServerFactory";

const serverFactory = new ServerFactory();
const server = serverFactory.makeServer(<ServerConfigInterface>{});
server.start();
