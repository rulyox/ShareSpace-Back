import express from 'express';
import userUtility from './user-utility';
import userController from './user-controller';
import utility from "../utility";

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

        const loginResultCode: number = await userController.checkLogin(email, pw);

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

Login.

Request Header
token : string

Response JSON
{id: number, email: string, name: string}
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

        const userDataResult: {result: boolean, email? :string, name?: string} = await userController.getUserData(user);

        response.json({
            id: user,
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

        const addUserResult: number = await userController.createUser(email, pw, name);

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
    const formData: {image: object} = await userController.parseProfileForm(request);

    // auth check
    if(user === null) {
        response.status(401).end();
        return;
    }

    utility.print(`POST /user/image user: ${user}`);

    try {

        await userController.addProfileImage(user, formData.image);

        response.json({ 'result': true });

    } catch(error) { next(error); }

};

/*
GET /user/data/:id

Get user data.

Request Param
id : number

Response JSON
{name: string}
*/
const getData = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const id = Number(request.params.id);

    // type check
    if(isNaN(id)) {
        response.status(400).end();
        return;
    }

    utility.print(`GET /user/data ${id}`);

    try {

        const userDataResult: {result: boolean, email? :string, name?: string} = await userController.getUserData(id);

        // user exist check
        if(!userDataResult.result) {
            response.status(404).end();
            return;
        }

        response.json({ name: userDataResult.name! });

    } catch(error) { next(error); }

};

export default {
    postToken,
    get,
    post,
    postImage,
    getData
};
