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

            const resultCode: number = await userDAO.checkLogin(email, pw);

            switch(resultCode) {

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

            const user: User|null = await userDAO.get(userId);

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

            const resultCode: number = await userDAO.create(email, pw, name);

            switch(resultCode) {

                case 101:
                    resolve(utility.result(101, 'OK', undefined));
                    break;

                case 201:
                    resolve(utility.result(201, 'Email exists', undefined));
                    break;

            }

        } catch(error) { reject(error); }

    });
};

/*
Change user data.

Response Code
101 : OK
*/
export const put = async (user: number, name: string, pw: string): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`PUT /user | user: ${user} name: ${name}`);

            await userDAO.edit(user, name, pw);

            resolve(utility.result(101, 'OK', undefined));

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

            const user: User|null = await userDAO.getByAccess(access);

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
*/
export const getImage = async (access: string): Promise<string|null> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /user/image | access: ${access}`);

            const user: User|null = await userDAO.getByAccess(access);

            // user exist check
            if(user === null) {
                resolve(null);
                return;
            }

            const image = user.image;

            // no profile image
            if(image === null) {
                resolve(null);
                return;
            }

            resolve(path.join(__dirname, '../../../', dataConfig.imageDir, image));

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

            await userDAO.addImage(user, formData.image);

            resolve(utility.result(101, 'OK', undefined));

        } catch(error) { reject(error); }

    });
};

/*
Search user.

Response JSON Result
{access: string, name: string, image: string}[]
*/
export const getSearch = async (query: string): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /user/search | query: ${query}`);

            const userList: User[] = await userDAO.searchUser(query);

            const result: {access: string, name: string, image: string}[] = [];

            for(const user of userList) {

                result.push({
                    access: user.access,
                    name: user.name,
                    image: user.image
                });

            }

            resolve(utility.result(101, 'OK', result));

        } catch(error) { reject(error); }

    });
};
