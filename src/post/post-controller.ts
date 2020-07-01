import express from 'express';
import { postService, postUtility } from '../post';

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
export const post = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

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
        const result: APIResult = await postService.post(user, formData);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Delete post.

Request Header
token : string

Request Param
access : string

Response JSON
{code: number, message: string}

Response Code
101 : OK
201 : Post does not exist
202 : No authorization
*/
export const deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

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
        const result: APIResult = await postService.deletePost(user, access);
        response.json(result);

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
export const getData = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

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
        const result: APIResult = await postService.getData(user, access);
        response.json(result);

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
export const getPreview = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

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
        const result: APIResult = await postService.getPreview(user, access);
        response.json(result);

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
export const getFeed = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

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
        const result: APIResult = await postService.getFeed(user, start, count);
        response.json(result);

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
export const getUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

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
        const result: APIResult = await postService.getUser(user, access, start, count);
        response.json(result);

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

Response Code
101 : OK
201 : Post does not exist
202 : Image does not exist
*/
export const getImage = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

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
        const result: APIResult = await postService.getImage(user, access, image);
        if(result.code === 101) response.sendFile(result.result);
        else response.json(result);

    } catch(error) { next(error); }

};

/*
Get likes of post.

Request Header
token : string

Request Param
access : string

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{user: string[]}

Response Code
101 : OK
201 : Post does not exist
*/
export const getLike = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

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
        const result: APIResult = await postService.getLike(user, access);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Like post.

Request Header
token : string

Request Param
access : string

Request Body JSON
{type: boolean}

Response JSON
{code: number, message: string}

Response Code
101 : OK
201 : Post does not exist
*/
export const postLike = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const user = response.locals.user;
        const access = request.params.access;
        const type = request.body.type;

        // type check
        if(access === null || typeof type !== 'boolean') {
            response.status(400).end();
            return;
        }

        // auth check
        if(user === null) {
            response.status(401).end();
            return;
        }

        // response
        const result: APIResult = await postService.postLike(user, access, type);
        response.json(result);

    } catch(error) { next(error); }

};
