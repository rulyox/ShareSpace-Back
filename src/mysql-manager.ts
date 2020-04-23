import mysql from 'mysql';
import dbConfig from '../config/db.json';

const dbConnection = mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.pw,
    database: dbConfig.name
});

const start = (): void => {

    dbConnection.connect();

};

const end = (): void => {

    dbConnection.end();

};

const execute = (query: string): Promise<any> =>{
    return new Promise((resolve, reject) => {

        dbConnection.query(query, (error, result, fields) => {
            if(error) reject(error);
            else resolve(result);
        });

    });
};

export default {
    start,
    end,
    execute
};
