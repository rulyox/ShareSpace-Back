import path from 'path';
import * as mysqlManager from '../mysql-manager';
import { User } from './user';
import * as userUtility from './user-utility';
import * as userSQL from './user-sql';
import * as utility from '../utility';
import dataConfig from '../../config/data.json';

/*
Result Code
101 : OK
201 : Wrong email
202 : Wrong password
*/
export const checkLogin = (email: string, pw: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {

        try {

            // hash password
            const pwResult: {result: boolean, pw?: string} = await getHashedPassword(email, pw);

            if(pwResult.result) {

                const hashedPassword = pwResult.pw!;

                const loginQuery = await mysqlManager.execute(userSQL.select(email, hashedPassword));

                if(loginQuery.length === 1) resolve(101);
                else resolve(202);

            } else resolve(201);

        } catch(error) { reject(error); }

    });
};

export const checkToken = (token: string): Promise<{auth: boolean, id?: number, email?: string, name?: string}> => {
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

                // hash password
                const pwResult: {result: boolean, pw?: string} = await getHashedPassword(email, pw);

                const hashedPassword = pwResult.pw!;

                const loginQuery = (await mysqlManager.execute(userSQL.select(email, hashedPassword)))[0];

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

export const getHashedPassword = (email: string, pw: string): Promise<{result: boolean, pw?: string}> => {
    return new Promise(async (resolve, reject) => {

        try {

            const saltQuery = await mysqlManager.execute(userSQL.selectSaltByEmail(email));

            if(saltQuery.length === 1) {

                const salt: string = saltQuery[0].salt;
                const hashedPassword: string = userUtility.hash(pw, salt);

                resolve({
                    result: true,
                    pw: hashedPassword
                });

            } else resolve({ result: false });

        } catch(error) { reject(error); }

    });
};

export const getUserById = (id: number): Promise<User> => {
    return new Promise(async (resolve, reject) => {

        try {

            const getUserQuery = (await mysqlManager.execute(userSQL.selectByID(id)));

            if(getUserQuery?.length === 0) { // if id does not exist

                resolve(undefined);

            } else {

                const userData = getUserQuery[0];

                const user = new User(userData.id, userData.access, userData.email, userData.name, userData.image);
                resolve(user);

            }

        } catch(error) { reject(error); }

    });
};

export const getUserByAccess = (access: string): Promise<User> => {
    return new Promise(async (resolve, reject) => {

        try {

            const getUserQuery = (await mysqlManager.execute(userSQL.selectByAccess(access)));

            if(getUserQuery?.length === 0) { // if access does not exist

                resolve(undefined);

            } else {

                const userData = getUserQuery[0];

                const user = new User(userData.id, userData.access, userData.email, userData.name, userData.image);
                resolve(user);

            }

        } catch(error) { reject(error); }

    });
};

/*
Result Code
101 : OK
201 : Email exists
*/
export const createUser = (email: string, pw: string, name: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {

        try {

            // check if same email exists
            const emailCheckQuery = await mysqlManager.execute(userSQL.checkEmail(email));

            if(emailCheckQuery.length === 0) {

                // generate random access key
                const access: string = await userUtility.createRandomAccess();

                // generate salt for hashing
                const salt = userUtility.createRandomSalt();

                // generate hashed password
                pw = userUtility.hash(pw, salt);

                const userAddQuery = await mysqlManager.execute(userSQL.add(access, email, pw, salt, name));

                if(userAddQuery.affectedRows === 1) resolve(101);
                else reject('User Add Failed')

            } else resolve(201);

        } catch(error) { reject(error); }

    });
};

export const addProfileImage = (user: number, image: any): Promise<void> => {
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
