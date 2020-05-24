import express from 'express';
import postResponse from './post-response';
import postUtility from './post-utility';

/*
Write new post.

Request Header
token : string

Request Form
text : string
files

Response JSON
{code: number, message: string}

Response Code
101 : OK
*/
const post = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const user = response.locals.user;
        const formData: {text: string, images: object[]} = await postUtility.parseForm(request);

        // auth check
        if(user === null) {
            response.status(401).end();
            return;
        }

        // response
        await postResponse.post(response, user, formData);

    } catch(error) { next(error); }

};

/*
Get post data.

Request Header
token : string

Request Param
access : string

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{user: string, name: string, profile: string, text: string, image: string[]}

Response Code
101 : OK
201 : Post does not exist
*/
const getData = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const user = response.locals.user;
        const access = request.params.access;

        // type check
        if(access === null) {
            response.status(400).end();
            return;
        }

        // auth check
        if(user === null) {
            response.status(401).end();
            return;
        }

        // response
        await postResponse.getData(response, user, access);

    } catch(error) { next(error); }

};

/*
Get post preview.

Request Header
token : string

Request Param
access : string

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{user: string, name: string, profile: string, text: string, image: string}

Response Code
101 : OK
201 : Post does not exist
*/
const getPreview = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const user = response.locals.user;
        const access = request.params.access;

        // type check
        if(access === null) {
            response.status(400).end();
            return;
        }

        // auth check
        if(user === null) {
            response.status(401).end();
            return;
        }

        // response
        await postResponse.getPreview(response, user, access);

    } catch(error) { next(error); }

};

/*
Get feed.

Request Header
token : string

Request Query
start : number (starts from 0)
count : number

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{post: string[]}

Response Code
101 : OK
*/
const getFeed = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const user = response.locals.user;
        const start = Number(request.query.start);
        const count = Number(request.query.count);

        // type check
        if(isNaN(start) || isNaN(count)) {
            response.status(400).end();
            return;
        }

        // auth check
        if(user === null) {
            response.status(401).end();
            return;
        }

        // response
        await postResponse.getFeed(response, user, start, count);

    } catch(error) { next(error); }

};

/*
Get post list by user.

Request Header
token : string

Request Param
access : string

Request Query
start : number (starts from 0)
count : number

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{total: number, list: string[]}

Response Code
101 : OK
201 : User does not exist
201 : Wrong range
*/
const getUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const user = response.locals.user;
        const access = request.params.access;
        const start = Number(request.query.start);
        const count = Number(request.query.count);

        // type check
        if(access === null || isNaN(start) || isNaN(count)) {
            response.status(400).end();
            return;
        }

        // auth check
        if(user === null) {
            response.status(401).end();
            return;
        }

        // response
        await postResponse.getUser(response, user, access, start, count);

    } catch(error) { next(error); }

};

/*
Get image file.

Request Header
token : string

Request Param
access : string
image: string

Response
image file
*/
const getImage = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const user = response.locals.user;
        const access = request.params.access;
        const image = request.params.image;

        // type check
        if(access === null || image === null) {
            response.status(400).end();
            return;
        }

        // auth check
        if(user === null) {
            response.status(401).end();
            return;
        }

        // response
        await postResponse.getImage(response, user, access, image);

    } catch(error) { next(error); }

};

export default {
    post,
    getData,
    getPreview,
    getFeed,
    getUser,
    getImage
};
