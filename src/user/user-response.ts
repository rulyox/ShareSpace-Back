import express from 'express';
import path from 'path';
import userDao from './user-dao';
import userUtility from './user-utility';
import utility from '../utility';
import dataConfig from '../../config/data.json';

/*
Check login and create token.

Response JSON
{result: number, message: string, token: string}

Result Code
101 : OK
201 : Wrong email
202 : Wrong password
*/
const postToken = async (response: express.Response, email: string, pw: string) => {

    // print log
    utility.print(`POST /user/token ${email}`);

    const loginResultCode: number = await userDao.checkLogin(email, pw);

    switch(loginResultCode) {

        case 101:
            const token: string = userUtility.createToken(email, pw);

            response.json({
                result: 101,
                message: 'OK',
                token: token
            });

            break;

        case 201:
            response.json({
                result: 201,
                message: 'Wrong email'
            });

            break;

        case 202:
            response.json({
                result: 202,
                message: 'Wrong password'
            });

            break;
    }

};

/*
Login using token.

Response JSON
{access: string, email: string, name: string}
*/
const get = async (response: express.Response, user: number) => {

    // print log
    utility.print(`GET /user user: ${user}`);

    const userDataResult: {result: boolean, access? :string, email? :string, name?: string} = await userDao.getUserData(user);

    response.json({
        access: userDataResult.access!,
        email: userDataResult.email!,
        name: userDataResult.name!
    });

};

/*
Sign up.

Response JSON
{result: number, message: string}

Result Code
101 : OK
201 : Email exists
*/
const post = async (response: express.Response, email: string, pw: string, name: string) => {

    // print log
    utility.print(`POST /user ${email}`);

    const addUserResult: number = await userDao.createUser(email, pw, name);

    let resultMessage: string = '';
    if(addUserResult === 101) resultMessage = 'OK';
    else if(addUserResult === 201) resultMessage = 'Email exists';

    response.json({
        result: addUserResult,
        message: resultMessage
    });

};

/*
Get user data.

Response JSON
{name: string, image: string}
*/
const getData = async (response: express.Response, access: string) => {

    // print log
    utility.print(`GET /user/data ${access}`);

    const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

    // user exist check
    if(!accessResult.result || accessResult.id === undefined) {
        response.status(404).end();
        return;
    }

    const id = accessResult.id;

    const userDataResult: {result: boolean, email? :string, name?: string, image?: string} = await userDao.getUserData(id);

    response.json({
        name: userDataResult.name!,
        image: userDataResult.image!,
    });

};

/*
Get profile image.

Response
image file
*/
const getImage = async (response: express.Response, access: string) => {

    // print log
    utility.print(`GET /user/image ${access}`);

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
{result: boolean}
*/
const postImage = async (response: express.Response, user: number, formData: {image: object}) => {

    // print log
    utility.print(`POST /user/image user: ${user}`);

    await userDao.addProfileImage(user, formData.image);

    response.json({ result: true });

};

export default {
    postToken,
    get,
    post,
    getData,
    getImage,
    postImage
};
