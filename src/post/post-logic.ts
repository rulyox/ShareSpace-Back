import express from 'express';
import path from 'path';
import postUtility from './post-utility';
import postController from './post-controller';
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
{postId: number}
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

        const postId: number = await postController.writePost(user, formData.text, formData.images);

        response.json({
            postId: postId
        });

    } catch(error) { next(error); }

};

/*
GET /post/user/:id

Get post list by user.

Request Header
token : string

Request Param
id : number

Request Query
start : number (starts from 0)
count : number

Response JSON
{result: number, message: string, total: number, list: number[]}

Result Code
101 : OK
201 : Wrong range
*/
const getUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const user = response.locals.user;
    const id = Number(request.params.id);
    const start = Number(request.query.start);
    const count = Number(request.query.count);

    // type check
    if(isNaN(id) || isNaN(start) || isNaN(count)) {
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

        // get number of posts by user
        const postCount = await postController.getNumberOfPostByUser(id);

        // start should be 0 from postCount-1
        if(start >= 0 && start < postCount) {

            // get post list by user
            const postList: number[] = await postController.getPostByUser(id, start, count);

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
GET /post/data/:id

Get post data.

Request Header
token : string

Request Param
id : number

Response JSON
{result: number, message: string, data: {user: number, name: string, profile: string, text: string, image: string[]}}

Result Code
101 : OK
201 : Post does not exist
*/
const getData = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const user = response.locals.user;
    const id = Number(request.params.id);

    // type check
    if(isNaN(id)) {
        response.status(400).end();
        return;
    }

    // auth check
    if(user === null) {
        response.status(401).end();
        return;
    }

    utility.print(`GET /post user: ${user} id: ${id}`);

    try {

        const postData: {result: number, user?: number, name?: string, profile?: string, text?: string, image?: string[]} = await postController.getPostData(id);

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
GET /post/image/:post/:image

Get image file.

Request Header
token : string

Request Param
post : number
image: string

Response
image file
*/
const getImage = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const user = response.locals.user;
    const post = Number(request.params.post);
    const image = request.params.image; // always string

    // type check
    if(isNaN(post)) {
        response.status(400).end();
        return;
    }

    // auth check
    if(user === null) {
        response.status(401).end();
        return;
    }

    utility.print(`GET /post/image user: ${user} post: ${post} image: ${image}`);

    try {

        const imageResult: boolean = await postController.checkImage(post, image);

        if(imageResult) response.sendFile(path.join(__dirname, '../../../', dataConfig.imageDir, image));
        else response.status(404).end();

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
{post: number[]}
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

        const feedData: number[] = await postController.getFeed(user, start, count);

        response.json({ post: feedData });

    } catch(error) { next(error); }

};

export default {
    post,
    getUser,
    getData,
    getImage,
    getFeed
};
