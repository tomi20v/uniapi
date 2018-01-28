import {app} from "./app";
import * as http from 'http';

const server = http.createServer(app);
server.listen(app.get('port'));
