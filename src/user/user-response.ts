import express from 'express';
import path from 'path';
import userDao from './user-dao';
import userUtility from './user-utility';
import utility from '../utility';
import dataConfig from '../../config/data.json';

/*
Check login and create token.

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{token: string}

Response Code
101 : OK
201 : Wrong email
202 : Wrong password
*/
const postToken = async (response: express.Response, email: string, pw: string) => {

    // print log
    utility.print(`POST /user/token | email: ${email}`);

    const loginResultCode: number = await userDao.checkLogin(email, pw);

    switch(loginResultCode) {

        case 101:
            const token: string = userUtility.createToken(email, pw);

            const result = {
                token: token
            };

            utility.sendResponse(response, 101, 'OK', result);

            break;

        case 201:
            utility.sendResponse(response, 201, 'Wrong email', undefined);

            break;

        case 202:
            utility.sendResponse(response, 202, 'Wrong password', undefined);

            break;

    }

};

/*
Login using token.

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{access: string, email: string, name: string}

Response Code
101 : OK
*/
const get = async (response: express.Response, user: number) => {

    // print log
    utility.print(`GET /user | user: ${user}`);

    const userDataResult: {result: boolean, access? :string, email? :string, name?: string} = await userDao.getUserData(user);

    const result = {
        access: userDataResult.access,
        email: userDataResult.email,
        name: userDataResult.name
    };

    utility.sendResponse(response, 101, 'OK', result);

};

/*
Sign up.

Response JSON
{code: number, message: string}

Response Code
101 : OK
201 : Email exists
*/
const post = async (response: express.Response, email: string, pw: string, name: string) => {

    // print log
    utility.print(`POST /user | email: ${email}`);

    const addUserResultCode: number = await userDao.createUser(email, pw, name);

    switch(addUserResultCode) {

        case 101:
            utility.sendResponse(response, 101, 'OK', undefined);

            break;

        case 201:
            utility.sendResponse(response, 201, 'Email exists', undefined);

            break;

    }

};

/*
Get user data.

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{name: string, image: string}

Response Code
101 : OK
201 : User does not exist
*/
const getData = async (response: express.Response, access: string) => {

    // print log
    utility.print(`GET /user/data | access: ${access}`);

    const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

    // user exist check
    if(!accessResult.result || accessResult.id === undefined) {
        utility.sendResponse(response, 201, 'User does not exist', undefined);
        return;
    }

    const id = accessResult.id;

    const userDataResult: {result: boolean, email? :string, name?: string, image?: string} = await userDao.getUserData(id);

    const result = {
        name: userDataResult.name,
        image: userDataResult.image
    };

    utility.sendResponse(response, 101, 'OK', result);

};

/*
Get profile image.

Response
image file
*/
const getImage = async (response: express.Response, access: string) => {

    // print log
    utility.print(`GET /user/image | access: ${access}`);

    const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

    // user exist check
    if(!accessResult.result || accessResult.id === undefined) {
        response.status(404).end();
        return;
    }

    const id = accessResult.id;

    const userDataResult: {result: boolean, email? :string, name?: string, image?: string} = await userDao.getUserData(id);

    const image = userDataResult.image;

    // no profile image
    if(image === null) {
        response.end();
        return
    }

    response.sendFile(path.join(__dirname, '../../../', dataConfig.imageDir, image!));

};

/*
Add profile image.

Response JSON
{code: number, message: string}

Response Code
101 : OK
*/
const postImage = async (response: express.Response, user: number, formData: {image: object}) => {

    // print log
    utility.print(`POST /user/image | user: ${user}`);

    await userDao.addProfileImage(user, formData.image);

    utility.sendResponse(response, 101, 'OK', undefined);

};

export default {
    postToken,
    get,
    post,
    getData,
    getImage,
    postImage
};
