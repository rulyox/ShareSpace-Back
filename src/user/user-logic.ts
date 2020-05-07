import express from 'express';
import path from 'path';
import userDao from './user-dao';
import userUtility from './user-utility';
import utility from '../utility';
import dataConfig from '../../config/data.json';

/*
POST /user/token

Check login and create token.

Request Body JSON
{email: string, pw: string}

Response JSON
{result: number, message: string, token: string}

Result Code
101 : OK
201 : Wrong email or password
*/
const postToken = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const email = request.body.email;
    const pw = request.body.pw;

    // type check
    if(typeof email !== 'string' || typeof pw !== 'string') {
        response.status(400).end();
        return;
    }

    utility.print(`POST /user/token ${email}`);

    try {

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
                    message: 'Wrong email or password'
                });

                break;

        }

    } catch(error) { next(error); }

};

/*
GET /user

Login using token.

Request Header
token : string

Response JSON
{access: string, email: string, name: string}
*/
const get = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const user = response.locals.user;

    // auth check
    if(user === null) {
        response.status(401).end();
        return;
    }

    utility.print(`GET /user user: ${user}`);

    try {

        const userDataResult: {result: boolean, access? :string, email? :string, name?: string} = await userDao.getUserData(user);

        response.json({
            access: userDataResult.access!,
            email: userDataResult.email!,
            name: userDataResult.name!
        });

    } catch(error) { next(error); }

};

/*
POST /user

Sign up.

Request Body JSON
{email: string, pw: string, name: string}

Response JSON
{result: number, message: string}

Result Code
101 : OK
201 : Email exists
*/
const post = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const email = request.body.email;
    const pw = request.body.pw;
    const name = request.body.name;

    // type check
    if(typeof email !== 'string' || typeof pw !== 'string' || typeof name !== 'string') {
        response.status(400).end();
        return;
    }

    utility.print(`POST /user ${email}`);

    try {

        const addUserResult: number = await userDao.createUser(email, pw, name);

        let resultMessage: string = '';
        if(addUserResult === 101) resultMessage = 'OK';
        else if(addUserResult === 201) resultMessage = 'Email exists';

        response.json({
            result: addUserResult,
            message: resultMessage
        });

    } catch(error) { next(error); }

};

/*
GET /user/data/:access

Get user data.

Request Param
access : string

Response JSON
{name: string, image: string}
*/
const getData = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const access = request.params.access;

    // type check
    if(access === null) {
        response.status(400).end();
        return;
    }

    utility.print(`GET /user/data ${access}`);

    try {

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

    } catch(error) { next(error); }

};

/*
GET /user/image/:access

Get profile image.

Request Param
access : string

Response
image file
*/
const getImage = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const access = request.params.access;

    // type check
    if(access === null) {
        response.status(400).end();
        return;
    }

    utility.print(`GET /user/image ${access}`);

    try {

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

    } catch(error) { next(error); }

};

/*
POST /user/image

Add profile image.

Request Header
token : string

Request Form
files

Response JSON
{result: boolean}
*/
const postImage = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const user = response.locals.user;
    const formData: {image: object} = await userUtility.parseForm(request);

    // auth check
    if(user === null) {
        response.status(401).end();
        return;
    }

    utility.print(`POST /user/image user: ${user}`);

    try {

        await userDao.addProfileImage(user, formData.image);

        response.json({ 'result': true });

    } catch(error) { next(error); }

};

export default {
    postToken,
    get,
    post,
    getData,
    getImage,
    postImage
};
