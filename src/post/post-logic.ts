import express from 'express';
import path from 'path';
import postUtility from './post-utility';
import postController from './post-controller';
import userController from '../user/user-controller';
import utility from '../utility';
import dataConfig from '../../config/data.json';

/*
POST /post

Write new post.

Request Header
token : string

Request Form
text : string
files

Response JSON
{result: number, message: string}

Result Code
101 : OK
*/
const post = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const user = response.locals.user;
    const formData: {text: string, images: object[]} = await postUtility.parseForm(request);

    // auth check
    if(user === null) {
        response.status(401).end();
        return;
    }

    utility.print(`POST /post user: ${user} file: ${formData.images.length}`);

    try {

        const access: string = await postController.createRandomAccess();

        const addPostResult: number = await postController.writePost(access, user, formData.text, formData.images);

        let resultMessage: string = '';
        if(addPostResult === 101) resultMessage = 'OK';

        response.json({
            result: addPostResult,
            message: resultMessage
        });

    } catch(error) { next(error); }

};

/*
GET /post/data/:access

Get post data.

Request Header
token : string

Request Param
access : string

Response JSON
{result: number, message: string, data: {user: string, name: string, profile: string, text: string, image: string[]}}

Result Code
101 : OK
201 : Post does not exist
*/
const getData = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

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

    utility.print(`GET /post user: ${user} access: ${access}`);

    try {

        const accessResult: {result: boolean, id?: number} = await postController.getPostFromAccess(access);

        // post exist check
        if(!accessResult.result || accessResult.id === undefined) {
            response.status(404).end();
            return;
        }

        const id = accessResult.id;

        const postData: {result: number, user?: string, name?: string, profile?: string, text?: string, image?: string[]} = await postController.getPostData(id);

        switch(postData.result) {

            case 101:
                response.json({
                    result: 101,
                    message: 'OK',
                    data: {
                        user: postData.user,
                        name: postData.name,
                        profile: postData.profile,
                        text: postData.text,
                        image: postData.image
                    }
                });

                break;

            case 201:
                response.json({
                    result: 201,
                    message: 'Post does not exist'
                });

                break;

        }

    } catch(error) { next(error); }

};

/*
GET /post/feed

Get feed.

Request Header
token : string

Request Query
start : number (starts from 0)
count : number

Response JSON
{post: string[]}
*/
const getFeed = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

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

    utility.print(`GET /post/feed user: ${user}`);

    try {

        const feedData: string[] = await postController.getFeed(user, start, count);

        response.json({ post: feedData });

    } catch(error) { next(error); }

};

/*
GET /post/user/:access

Get post list by user.

Request Header
token : string

Request Param
access : string

Request Query
start : number (starts from 0)
count : number

Response JSON
{result: number, message: string, total: number, list: string[]}

Result Code
101 : OK
201 : Wrong range
*/
const getUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

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

    utility.print(`GET /post/user user: ${user} start: ${start} count: ${count}`);

    try {

        const accessResult: {result: boolean, id?: number} = await userController.getUserFromAccess(access);

        // user exist check
        if(!accessResult.result || accessResult.id === undefined) {
            response.status(404).end();
            return;
        }

        const id = accessResult.id;

        // get number of posts by user
        const postCount = await postController.getNumberOfPostByUser(id);

        // start should be 0 from postCount-1
        if(start >= 0 && start < postCount) {

            // get post list by user
            const postList: string[] = await postController.getPostByUser(id, start, count);

            response.json({
                result: 101,
                message: 'OK',
                total: postCount,
                list: postList
            });

        } else {

            response.json({
                result: 201,
                message: 'Wrong range',
                total: postCount
            });

        }

    } catch(error) { next(error); }

};

/*
GET /post/image/:access/:image

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

    utility.print(`GET /post/image user: ${user} access: ${access} image: ${image}`);

    try {

        const accessResult: {result: boolean, id?: number} = await postController.getPostFromAccess(access);

        // post exist check
        if(!accessResult.result || accessResult.id === undefined) {
            response.status(404).end();
            return;
        }

        const id = accessResult.id;

        const imageResult: boolean = await postController.checkImage(id, image);

        if(imageResult) response.sendFile(path.join(__dirname, '../../../', dataConfig.imageDir, image));
        else response.status(404).end();

    } catch(error) { next(error); }

};

export default {
    post,
    getData,
    getFeed,
    getUser,
    getImage
};
