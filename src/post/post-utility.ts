import express from 'express';
import formidable from 'formidable';
import crypto from 'crypto';
import * as DB from '../mysql-manager';
import { postSQL } from '../post';

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

export const createPostRandomAccess = (): Promise<string> => {
    return new Promise(async (resolve, reject) => {

        try {

            let access;
            let getAccessQuery;

            do {

                const random = crypto.randomBytes(10);
                access = 'p' + random.toString('hex');

                getAccessQuery = (await DB.execute(postSQL.selectIdByAccess(access)));

            } while(getAccessQuery.length !== 0);

            resolve(access);

        } catch(error) { reject(error); }

    });
};

export const createCommentRandomAccess = (): Promise<string> => {
    return new Promise(async (resolve, reject) => {

        try {

            let access;
            let getAccessQuery;

            do {

                const random = crypto.randomBytes(10);
                access = 'c' + random.toString('hex');

                getAccessQuery = (await DB.execute(postSQL.selectCommentByAccess(access)));

            } while(getAccessQuery.length !== 0);

            resolve(access);

        } catch(error) { reject(error); }

    });
};
