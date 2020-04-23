import express from 'express';
import bodyParser from 'body-parser';
import mysqlManager from './src/mysql-manager';
import api from './src/api';
import utility from './src/utility';
import serverConfig from './config/server.json';

// database
mysqlManager.start();

// express app
const app = express();
const port = serverConfig.port;

// middleware
app.use(bodyParser.json());
app.use(utility.authChecker);

// route
app.use('/api', api);

// error handler
app.use(utility.errorHandler);

app.listen(port, () => utility.print(`Server listening on port ${port}...`));
