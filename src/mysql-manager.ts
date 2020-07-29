import mysql from 'mysql';
import dbConfig from '../config/db.json';

const config = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.pw,
    database: dbConfig.name
};

const pool = mysql.createPool(config);

export const run = (query: string): Promise<any> =>{
    return new Promise((resolve, reject) => {

        pool.query(query, (error, result) => {

            if(error) reject(error);
            else resolve(result);

        });

    });
};
