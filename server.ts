import express from 'express';
import bodyParser from 'body-parser';
import api from './src/api';
import * as mysqlManager from './src/mysql-manager';
import * as middleware from './src/middleware';
import * as utility from './src/utility';
import serverConfig from './config/server.json';

// database
mysqlManager.start();

// express app
const app = express();
const port = serverConfig.port;

// middleware
app.use(bodyParser.json());
app.use(middleware.authChecker);

// route
app.use('/api', api);

// error handler
app.use(middleware.errorHandler);

app.listen(port, () => utility.print(`Server listening on port ${port}...`));
