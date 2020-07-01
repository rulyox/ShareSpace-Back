import path from 'path';
import { User, userDAO, userUtility } from '../user';
import * as utility from '../utility';
import dataConfig from '../../config/data.json';

/*
Check login and create token.

Response JSON Result
{token: string}

Response Code
101 : OK
201 : Wrong email
202 : Wrong password
*/
export const postToken = async (email: string, pw: string): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`POST /user/token | email: ${email}`);

            const checkLogin: number = await userDAO.checkLogin(email, pw);

            switch(checkLogin) {

                case 101:
                    const token: string = userUtility.createToken(email, pw);

                    const result = {
                        token: token
                    };

                    resolve(utility.result(101, 'OK', result));
                    break;

                case 201:
                    resolve(utility.result(201, 'Wrong email', undefined));
                    break;

                case 202:
                    resolve(utility.result(202, 'Wrong password', undefined));
                    break;

            }

        } catch(error) { reject(error); }

    });
};

/*
Login using token.

Response JSON Result
{access: string, email: string, name: string}

Response Code
101 : OK
201 : User does not exist
*/
export const get = async (userId: number): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /user | user: ${userId}`);

            const user: User|null = await userDAO.getUserById(userId);

            if(user === null) {
                resolve(utility.result(201, 'User does not exist', undefined));
                return;
            }

            const result = {
                access: user.access,
                email: user.email,
                name: user.name
            };

            resolve(utility.result(101, 'OK', result));

        } catch(error) { reject(error); }

    });
};

/*
Sign up.

Response Code
101 : OK
201 : Email exists
*/
export const post = async (email: string, pw: string, name: string): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`POST /user | email: ${email}`);

            const createUser: number = await userDAO.createUser(email, pw, name);

            switch(createUser) {

                case 101:
                    resolve(utility.result(101, 'OK', undefined));
                    break;

                case 201:
                    resolve(utility.result(101, 'Email exists', undefined));
                    break;

            }

        } catch(error) { reject(error); }

    });
};

/*
Get user data.

Response JSON Result
{name: string, image: string}

Response Code
101 : OK
201 : User does not exist
*/
export const getData = async (access: string): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /user/data | access: ${access}`);

            const user: User|null = await userDAO.getUserByAccess(access);

            // user exist check
            if(user === null) {
                resolve(utility.result(201, 'User does not exist', undefined));
                return;
            }

            const result = {
                name: user.name,
                image: user.image
            };

            resolve(utility.result(101, 'OK', result));

        } catch(error) { reject(error); }

    });
};

/*
Get profile image.

Response
image file

Response Code
101 : OK
201 : User does not exist
202 : No profile image
*/
export const getImage = async (access: string): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /user/image | access: ${access}`);

            const user: User|null = await userDAO.getUserByAccess(access);

            // user exist check
            if(user === null) {
                resolve(utility.result(201, 'User does not exist', undefined));
                return;
            }

            const image = user.image;

            // no profile image
            if(image === null) {
                resolve(utility.result(202, 'No profile image', undefined));
                return;
            }

            resolve(utility.result(101, 'OK', path.join(__dirname, '../../../', dataConfig.imageDir, image)));

        } catch(error) { reject(error); }

    });
};

/*
Add profile image.

Response Code
101 : OK
*/
export const postImage = async (user: number, formData: {image: object}): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`POST /user/image | user: ${user}`);

            await userDAO.addProfileImage(user, formData.image);

            resolve(utility.result(101, 'OK', undefined));

        } catch(error) { reject(error); }

    });
};
