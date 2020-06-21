import express from 'express';
import formidable from 'formidable';
import crypto from 'crypto';
import * as mysqlManager from '../mysql-manager';
import * as userSQL from './user-sql';
import serverConfig from '../../config/server.json';

export const createToken = (email: string, pw: string): string => {

    const credential = {
        email: email,
        pw: pw
    };

    return encryptAES(JSON.stringify(credential));

};

export const encryptAES = (plainText: string): string => {

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', serverConfig.aes, iv);
    let encryptedText = cipher.update(plainText);
    encryptedText = Buffer.concat([encryptedText, cipher.final()]);

    return iv.toString('hex') + encryptedText.toString('hex');

};

export const decryptAES = (cipherText: string): string => {

    const iv = Buffer.from(cipherText.substring(0, 32), 'hex');
    const encryptedText = Buffer.from(cipherText.substring(32), 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', serverConfig.aes, iv);
    let decryptedText = decipher.update(encryptedText);
    decryptedText = Buffer.concat([decryptedText, decipher.final()]);

    return decryptedText.toString();

};

export const createRandomSalt = () => {

    const random = crypto.randomBytes(10);
    return random.toString('hex');

};

export const hash = (plainText: string, salt: string) => {

    const cipherText = crypto.pbkdf2Sync(plainText, salt, 100000, 64, 'sha512');
    return cipherText.toString('hex');

};

export const parseForm = (request: express.Request): Promise<{image: object}> => {
    return new Promise(async (resolve, reject) => {

        try {

            const formParser = new formidable.IncomingForm();
            formParser.parse(request, function (error, fields, files) {

                if(error) {
                    reject(error);
                    return
                }

                resolve({
                    image: Object.values(files)[0]
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
                access = 'u' + random.toString('hex');

                getAccessQuery = (await mysqlManager.execute(userSQL.selectIdByAccess(access)));

            } while(getAccessQuery.length !== 0);

            resolve(access);

        } catch(error) { reject(error); }

    });
};
