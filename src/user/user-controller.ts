import path from 'path';
import crypto from 'crypto';
import userUtility from './user-utility';
import mysqlManager from '../mysql-manager';
import userSQL from './user-sql';
import express from 'express';
import formidable from 'formidable';
import utility from '../utility';
import dataConfig from '../../config/data.json';

/*
Result Code
101 : OK
201 : Wrong email or password
*/
const checkLogin = (email: string, pw: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {

        try {

            const loginQuery = await mysqlManager.execute(userSQL.select(email, pw));

            if(loginQuery.length === 1) resolve(101);
            else resolve(201);

        } catch(error) { reject(error); }

    });
};

const checkToken = (token: string): Promise<{auth: boolean, id?: number, email?: string, name?: string}> => {
    return new Promise(async (resolve, reject) => {

        try {

            // get credential from token
            let credential = JSON.parse(userUtility.decryptAES(token));

            // type check
            const email = credential?.email;
            const pw = credential?.pw;

            if(typeof email !== 'string' || typeof pw !== 'string') {
                resolve({ auth: false });
                return;
            }

            // check login
            const loginResult: number = await checkLogin(email, pw);
            if(loginResult === 101) {

                const loginQuery = (await mysqlManager.execute(userSQL.select(email, pw)))[0];
                resolve({
                    auth: true,
                    id: loginQuery?.id,
                    email: loginQuery?.email,
                    name: loginQuery?.name
                });

            } else resolve({ auth: false });

        } catch(error) { reject(error); }

    });
};

/*
Result Code
101 : OK
201 : Email exists
*/
const createUser = (access: string, email: string, pw: string, name: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {

        try {

            // check if same email exists
            const emailCheckQuery = await mysqlManager.execute(userSQL.checkEmail(email));

            if(emailCheckQuery.length === 0) {

                const userAddQuery = await mysqlManager.execute(userSQL.add(access, email, pw, name));

                if(userAddQuery.affectedRows === 1) resolve(101);
                else reject('User Add Failed')

            } else resolve(201);

        } catch(error) { reject(error); }

    });
};

const parseProfileForm = (request: express.Request): Promise<{image: object}> => {
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

const addProfileImage = (user: number, image: any): Promise<void> => {
    return new Promise(async (resolve, reject) => {

        try {

            const originalPath = image.path;
            const imageName = `user_${user}.png`;

            // save image to png file
            await utility.saveImage(originalPath, path.join(__dirname, '../../../', dataConfig.imageDir, imageName));

            // add image to db
            await mysqlManager.execute(userSQL.addProfileImage(user, imageName));

            resolve();

        } catch(error) { reject(error); }

    });
};

const getUserData = (id: number): Promise<{result: boolean, access?: string, email?: string, name?: string, image?: string}> => {
    return new Promise(async (resolve, reject) => {

        try {

            const getUserQuery = (await mysqlManager.execute(userSQL.selectByID(id)));

            if(getUserQuery?.length === 0) { // if id does not exist

                resolve({ result: false });

            } else {

                const userData = getUserQuery[0];

                resolve({
                    result: true,
                    access: userData?.access,
                    email: userData?.email,
                    name: userData?.name,
                    image: userData?.image
                });

            }

        } catch(error) { reject(error); }

    });
};

const getUserFromAccess = (access: string): Promise<{result: boolean, id?: number}> => {
    return new Promise(async (resolve, reject) => {

        try {

            const getUserQuery = (await mysqlManager.execute(userSQL.selectIdByAccess(access)));

            if(getUserQuery?.length === 0) { // if id does not exist

                resolve({ result: false });

            } else {

                const userData = getUserQuery[0];

                resolve({
                    result: true,
                    id: userData?.id
                });

            }

        } catch(error) { reject(error); }

    });
};

const createRandomAccess = (): Promise<string> => {
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

export default {
    checkLogin,
    checkToken,
    createUser,
    parseProfileForm,
    addProfileImage,
    getUserData,
    getUserFromAccess,
    createRandomAccess
};
