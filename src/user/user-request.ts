import express from 'express';
import userResponse from './user-response';
import userUtility from './user-utility';

/*
Check login and create token.

Request Body JSON
{email: string, pw: string}

Response JSON
{result: number, message: string, token: string}

Result Code
101 : OK
201 : Wrong email
202 : Wrong password
*/
const postToken = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const email = request.body.email;
        const pw = request.body.pw;

        // type check
        if(typeof email !== 'string' || typeof pw !== 'string') {
            response.status(400).end();
            return;
        }

        // response
        await userResponse.postToken(response, email, pw);

    } catch(error) { next(error); }

};

/*
Login using token.

Request Header
token : string

Response JSON
{access: string, email: string, name: string}
*/
const get = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const user = response.locals.user;

        // auth check
        if(user === null) {
            response.status(401).end();
            return;
        }

        // response
        await userResponse.get(response, user);

    } catch(error) { next(error); }

};

/*
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

    try {

        // parse request
        const email = request.body.email;
        const pw = request.body.pw;
        const name = request.body.name;

        // type check
        if(typeof email !== 'string' || typeof pw !== 'string' || typeof name !== 'string') {
            response.status(400).end();
            return;
        }

        // response
        await userResponse.post(response, email, pw, name);

    } catch(error) { next(error); }

};

/*
Get user data.

Request Param
access : string

Response JSON
{name: string, image: string}
*/
const getData = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const access = request.params.access;

        // type check
        if(access === null) {
            response.status(400).end();
            return;
        }

        // response
        await userResponse.getData(response, access);

    } catch(error) { next(error); }

};

/*
Get profile image.

Request Param
access : string

Response
image file
*/
const getImage = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const access = request.params.access;

        // type check
        if(access === null) {
            response.status(400).end();
            return;
        }

        // response
        await userResponse.getImage(response, access);

    } catch(error) { next(error); }

};

/*
Add profile image.

Request Header
token : string

Request Form
files

Response JSON
{result: boolean}
*/
const postImage = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const user = response.locals.user;
        const formData: {image: object} = await userUtility.parseForm(request);

        // auth check
        if(user === null) {
            response.status(401).end();
            return;
        }

        // response
        await userResponse.postImage(response, user, formData);

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
