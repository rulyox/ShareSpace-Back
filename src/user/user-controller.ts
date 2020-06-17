import express from 'express';
import userService from './user-service';
import userUtility from './user-utility';

/*
Check login and create token.

Request Body JSON
{email: string, pw: string}

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{token: string}

Response Code
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
        const result = await userService.postToken(email, pw);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Login using token.

Request Header
token : string

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{access: string, email: string, name: string}

Response Code
101 : OK
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
        const result = await userService.get(user);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Sign up.

Request Body JSON
{email: string, pw: string, name: string}

Response JSON
{code: number, message: string}

Response Code
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
        const result = await userService.post(email, pw, name);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get user data.

Request Param
access : string

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{name: string, image: string}

Response Code
101 : OK
201 : User does not exist
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
        const result = await userService.getData(access);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Get profile image.

Request Param
access : string

Response
image file

Response Code
101 : OK
201 : User does not exist
202 : No profile image
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
        const result = await userService.getImage(access);
        if(result.code === 101) response.sendFile(result.result);
        else response.json(result);

    } catch(error) { next(error); }

};

/*
Add profile image.

Request Header
token : string

Request Form
files

Response JSON
{code: number, message: string}

Response Code
101 : OK
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
        const result = await userService.postImage(user, formData);
        response.json(result);

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
