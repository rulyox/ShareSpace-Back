import express from 'express';
import path from 'path';
import postDao from './post-dao';
import userDao from '../user/user-dao';
import utility from '../utility';
import dataConfig from '../../config/data.json';

/*
Write new post.

Response JSON
{code: number, message: string}

Response Code
101 : OK
*/
const post = async (response: express.Response, user: number, formData: {text: string, images: object[]}) => {

    // print log
    utility.print(`POST /post | user: ${user} file: ${formData.images.length}`);

    await postDao.writePost(user, formData.text, formData.images);

    response.json({
        code: 101,
        message: 'OK'
    });

};

/*
Get post data.

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{user: string, name: string, profile: string, text: string, image: string[]}

Response Code
101 : OK
201 : Post does not exist
*/
const getData = async (response: express.Response, user: number, access: string) => {

    // print log
    utility.print(`GET /post/data | user: ${user} access: ${access}`);

    const accessResult: {result: boolean, id?: number} = await postDao.getPostFromAccess(access);

    // post exist check
    if(!accessResult.result || accessResult.id === undefined) {
        response.status(404).end();
        return;
    }

    const id = accessResult.id;

    const postData: {result: number, user?: string, name?: string, profile?: string, text?: string, image?: string[]} = await postDao.getPostData(id);

    switch(postData.result) {

        case 101:
            const result = {
                user: postData.user,
                name: postData.name,
                profile: postData.profile,
                text: postData.text,
                image: postData.image
            };

            response.json({
                code: 101,
                message: 'OK',
                result: result
            });

            break;

        case 201:
            response.json({
                code: 201,
                message: 'Post does not exist'
            });

            break;

    }

};

/*
Get post preview.

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{user: string, name: string, profile: string, text: string, image: string}

Response Code
101 : OK
201 : Post does not exist
*/
const getPreview = async (response: express.Response, user: number, access: string) => {

    // print log
    utility.print(`GET /post/preview | user: ${user} access: ${access}`);

    const accessResult: {result: boolean, id?: number} = await postDao.getPostFromAccess(access);

    // post exist check
    if(!accessResult.result || accessResult.id === undefined) {
        response.status(404).end();
        return;
    }

    const id = accessResult.id;

    const postData: {result: number, user?: string, name?: string, profile?: string, text?: string, image?: string[]} = await postDao.getPostData(id);

    // create preview image from first image
    let previewImage: string|null = null;
    if(postData.image !== undefined && postData.image.length > 0) previewImage = postData.image[0];

    switch(postData.result) {

        case 101:
            const result = {
                user: postData.user,
                name: postData.name,
                profile: postData.profile,
                text: postData.text,
                image: previewImage
            };

            response.json({
                code: 101,
                message: 'OK',
                result: result
            });

            break;

        case 201:
            response.json({
                code: 201,
                message: 'Post does not exist'
            });

            break;

    }

};

/*
Get feed.

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{post: string[]}

Response Code
101 : OK
*/
const getFeed = async (response: express.Response, user: number, start: number, count: number) => {

    // print log
    utility.print(`GET /post/feed | user: ${user}`);

    const feedData: string[] = await postDao.getFeed(user, start, count);

    const result = {
        post: feedData
    };

    response.json({
        code: 101,
        message: 'OK',
        result: result
    });

};

/*
Get post list by user.

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{total: number, list: string[]}

Response Code
101 : OK
201 : User does not exist
201 : Wrong range
*/
const getUser = async (response: express.Response, user: number, access: string, start: number, count: number) => {

    // print log
    utility.print(`GET /post/user | user: ${user} start: ${start} count: ${count}`);

    const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

    // user exist check
    if(!accessResult.result || accessResult.id === undefined) {
        response.json({
            code: 201,
            message: 'User does not exist'
        });
        return;
    }

    const id = accessResult.id;

    // get number of posts by user
    const postCount = await postDao.getNumberOfPostByUser(id);

    // start should be 0 from postCount-1
    if(start >= 0 && start < postCount) {

        // get post list by user
        const postList: string[] = await postDao.getPostByUser(id, start, count);

        const result = {
            total: postCount,
            list: postList
        };

        response.json({
            code: 101,
            message: 'OK',
            result: result
        });

    } else {

        const result = {
            total: postCount
        };

        response.json({
            code: 202,
            message: 'Wrong range',
            result: result
        });

    }

};

/*
Get image file.

Response
image file
*/
const getImage = async (response: express.Response, user: number, access: string, image: string) => {

    // print log
    utility.print(`GET /post/image | user: ${user} access: ${access} image: ${image}`);

    const accessResult: {result: boolean, id?: number} = await postDao.getPostFromAccess(access);

    // post exist check
    if(!accessResult.result || accessResult.id === undefined) {
        response.status(404).end();
        return;
    }

    const id = accessResult.id;

    const imageResult: boolean = await postDao.checkImage(id, image);

    if(imageResult) response.sendFile(path.join(__dirname, '../../../', dataConfig.imageDir, image));
    else response.status(404).end();

};

export default {
    post,
    getData,
    getPreview,
    getFeed,
    getUser,
    getImage
};
