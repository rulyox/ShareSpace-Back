import express from 'express';
import formidable from 'formidable';
import crypto from 'crypto';
import * as mysqlManager from '../mysql-manager';
import * as postSQL from './post-sql';

export const parseForm = (request: express.Request): Promise<{text: string, images: object[]}> => {
    return new Promise(async (resolve, reject) => {

        try {

            const formParser = new formidable.IncomingForm();
            formParser.parse(request, function (error, fields, files) {

                if(error) {
                    reject(error);
                    return
                }

                if(typeof fields.text !== 'string') {
                    reject('FormData text is not string');
                    return;
                }

                resolve({
                    text: fields.text,
                    images: Object.values(files)
                });

            });

        } catch(error) { reject(error); }

    });
};

export const createRandomAccess = (): Promise<string> => {
    return new Promise(async (resolve, reject) => {

        try {

            let access;
            let getAccessQuery;

            do {

                const random = crypto.randomBytes(10);
                access = 'p' + random.toString('hex');

                getAccessQuery = (await mysqlManager.execute(postSQL.selectIdByAccess(access)));

            } while(getAccessQuery.length !== 0);

            resolve(access);

        } catch(error) { reject(error); }

    });
};
