import path from 'path';
import * as DB from '../mysql-manager';
import { User, userSQL, userUtility } from '../user';
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
            const hashedPassword: string = await getHashedPassword(email, pw);

            if(hashedPassword !== undefined) {

                const selectByEmailPw = await DB.run(userSQL.selectByEmailPw(email, hashedPassword));

                if(selectByEmailPw.length === 1) resolve(101);
                else resolve(202);

            } else resolve(201);

        } catch(error) { reject(error); }

    });
};

export const checkToken = (token: string): Promise<User|null> => {
    return new Promise(async (resolve, reject) => {

        try {

            // get credential from token
            const credential = JSON.parse(userUtility.decryptAES(token));

            // type check
            const email = credential.email;
            const pw = credential.pw;
            const time = credential.time;

            if(typeof email !== 'string' || typeof pw !== 'string' || typeof time !== 'number') {
                resolve(null);
                return;
            }

            // check valid time
            const currentTime = new Date().getTime();
            const validTime = time + (1000 * 60 * 60 * 24 * 7); // 1 week

            if(currentTime > validTime) {
                resolve(null);
                return;
            }

            // check login
            const loginResult: number = await checkLogin(email, pw);
            if(loginResult === 101) {

                // hash password
                const hashedPassword: string = await getHashedPassword(email, pw);

                const selectByEmailPw = await DB.run(userSQL.selectByEmailPw(email, hashedPassword));
                const userData = selectByEmailPw[0];

                const user = new User(userData.id, userData.access, userData.email, userData.name, userData.image);
                resolve(user);

            } else resolve(null);

        } catch(error) { reject(error); }

    });
};

export const getHashedPassword = (email: string, pw: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectSaltByEmail = await DB.run(userSQL.selectSaltByEmail(email));

            if(selectSaltByEmail.length === 1) {

                const salt: string = selectSaltByEmail[0].salt;
                const hashedPassword: string = userUtility.hash(pw, salt);

                resolve(hashedPassword);

            } else resolve(undefined);

        } catch(error) { reject(error); }

    });
};

export const get = (id: number): Promise<User|null> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectById = (await DB.run(userSQL.selectById(id)));

            if(selectById.length === 0) { // if id does not exist

                resolve(null);

            } else {

                const userData = selectById[0];

                const user = new User(userData.id, userData.access, userData.email, userData.name, userData.image);
                resolve(user);

            }

        } catch(error) { reject(error); }

    });
};

export const getByAccess = (access: string): Promise<User|null> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectByAccess = await DB.run(userSQL.selectByAccess(access));

            if(selectByAccess.length === 0) { // if access does not exist

                resolve(null);

            } else {

                const userData = selectByAccess[0];

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
export const create = (email: string, pw: string, name: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {

        try {

            // check if same email exists
            const checkEmail = await DB.run(userSQL.checkEmail(email));

            if(checkEmail.length === 0) {

                // generate random access key
                const access: string = await userUtility.createUserRandomAccess();

                // generate salt for hashing
                const salt = userUtility.createRandomSalt();

                // generate hashed password
                pw = userUtility.hash(pw, salt);

                const add = await DB.run(userSQL.add(access, email, pw, salt, name));

                if(add.affectedRows === 1) resolve(101);
                else reject('User Add Failed')

            } else resolve(201);

        } catch(error) { reject(error); }

    });
};

export const edit = (user: number, name: string, pw: string) => {
    return new Promise(async (resolve, reject) => {

        try {

            // generate salt for hashing
            const salt = userUtility.createRandomSalt();

            // generate hashed password
            pw = userUtility.hash(pw, salt);

            await DB.run(userSQL.update(user, name, pw, salt));

            resolve();

        } catch(error) { reject(error); }

    });
};

export const addImage = (user: number, image: any) => {
    return new Promise(async (resolve, reject) => {

        try {

            const originalPath = image.path;
            const imageName = `user_${user}.png`;

            // save image to png file
            await utility.saveImage(originalPath, path.join(__dirname, '../../../', dataConfig.imageDir, imageName));

            // add image to db
            await DB.run(userSQL.addImage(user, imageName));

            resolve();

        } catch(error) { reject(error); }

    });
};

export const searchUser = (query: string): Promise<User[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectByQuery = await DB.run(userSQL.selectByQuery(query));

            const userList: User[] = [];

            for(const item of selectByQuery) {

                const user = new User(item.id, item.access, item.email, item.name, item.image);
                userList.push(user);

            }

            resolve(userList)

        } catch(error) { reject(error); }

    });
};
