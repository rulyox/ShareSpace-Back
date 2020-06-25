import path from 'path';
import { User, userDAO } from '../user';
import { Post, postDAO } from '../post';
import * as utility from '../utility';
import dataConfig from '../../config/data.json';

/*
Write new post.

Response Code
101 : OK
*/
export const post = async (user: number, formData: {text: string, images: object[]}): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`POST /post | user: ${user} file: ${formData.images.length}`);

        await postDAO.writePost(user, formData.text, formData.images);

        resolve(utility.result(101, 'OK', undefined));

    });
};

/*
Delete post.

Response Code
101 : OK
201 : Post does not exist
202 : No authorization
*/
export const deletePost = async (userId: number, access: string): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`DELETE /post | user: ${userId}`);

        const postAccessResult: {result: boolean, id?: number} = await postDAO.getPostFromAccess(access);

        // post exist check
        if(!postAccessResult.result || postAccessResult.id === undefined) {
            resolve(utility.result(201, 'Post does not exist', undefined));
            return;
        }

        const postId = postAccessResult.id;
        const post: Post = await postDAO.getPostData(postId);

        // get owner
        const user: User = await userDAO.getUserByAccess(post.userAccess);

        if(userId === user.id) {

            await postDAO.deletePost(postId);

            resolve(utility.result(101, 'OK', undefined));

        } else {

            resolve(utility.result(202, 'No authorization', undefined));

        }

    });
};

/*
Get post data.

Response JSON Result
{user: string, name: string, profile: string, text: string, image: string[]}

Response Code
101 : OK
201 : Post does not exist
*/
export const getData = async (user: number, access: string): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`GET /post/data | user: ${user} access: ${access}`);

        const accessResult: {result: boolean, id?: number} = await postDAO.getPostFromAccess(access);

        // post exist check
        if(!accessResult.result || accessResult.id === undefined) {
            resolve(utility.result(201, 'Post does not exist', undefined));
            return;
        }

        const id = accessResult.id;
        const post: Post = await postDAO.getPostData(id);

        if(post !== undefined) {

            const result = {
                user: post.userAccess,
                name: post.userName,
                profile: post.userProfile,
                text: post.text,
                image: post.image
            };

            resolve(utility.result(101, 'OK', result));

        } else {

            resolve(utility.result(201, 'Post does not exist', undefined));

        }

    });
};

/*
Get post preview.

Response JSON Result
{user: string, name: string, profile: string, text: string, image: string}

Response Code
101 : OK
201 : Post does not exist
*/
export const getPreview = async (user: number, access: string): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`GET /post/preview | user: ${user} access: ${access}`);

        const accessResult: {result: boolean, id?: number} = await postDAO.getPostFromAccess(access);

        // post exist check
        if(!accessResult.result || accessResult.id === undefined) {
            resolve(utility.result(201, 'Post does not exist', undefined));
            return;
        }

        const id = accessResult.id;
        const post: Post = await postDAO.getPostData(id);

        if(post !== undefined) {

            // create preview image from first image
            let previewImage: string|null = null;
            if(post.image !== undefined && post.image.length > 0) previewImage = post.image[0];

            const result = {
                user: post.userAccess,
                name: post.userName,
                profile: post.userProfile,
                text: post.text,
                image: previewImage
            };

            resolve(utility.result(101, 'OK', result));

        } else {

            resolve(utility.result(201, 'Post does not exist', undefined));

        }

    });
};

/*
Get feed.

Response JSON Result
{post: string[]}

Response Code
101 : OK
*/
export const getFeed = async (user: number, start: number, count: number): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`GET /post/feed | user: ${user}`);

        const feedData: string[] = await postDAO.getFeed(user, start, count);

        const result = {
            post: feedData
        };

        resolve(utility.result(101, 'OK', result));

    });
};

/*
Get post list by user.

Response JSON Result
{total: number, list: string[]}

Response Code
101 : OK
201 : User does not exist
201 : Wrong range
*/
export const getUser = async (userId: number, access: string, start: number, count: number): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`GET /post/user | user: ${userId} start: ${start} count: ${count}`);

        const user: User = await userDAO.getUserByAccess(access);

        // user exist check
        if(user === undefined) {
            resolve(utility.result(201, 'User does not exist', undefined));
            return;
        }

        // get number of posts by user
        const postCount = await postDAO.getNumberOfPostByUser(userId);

        // start should be 0 from postCount-1
        if(start >= 0 && start < postCount) {

            // get post list by user
            const postList: string[] = await postDAO.getPostByUser(userId, start, count);

            const result = {
                total: postCount,
                list: postList
            };

            resolve(utility.result(101, 'OK', result));

        } else {

            const result = {
                total: postCount
            };

            resolve(utility.result(202, 'Wrong range', result));

        }

    });
};

/*
Get image file.

Response
image file

Response Code
101 : OK
201 : Post does not exist
202 : Image does not exist
*/
export const getImage = async (user: number, access: string, image: string): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`GET /post/image | user: ${user} access: ${access} image: ${image}`);

        const accessResult: {result: boolean, id?: number} = await postDAO.getPostFromAccess(access);

        // post exist check
        if(!accessResult.result || accessResult.id === undefined) {
            resolve(utility.result(201, 'Post does not exist', undefined));
            return;
        }

        const id = accessResult.id;

        const imageResult: boolean = await postDAO.checkImage(id, image);

        if(imageResult) resolve(utility.result(101, 'OK', path.join(__dirname, '../../../', dataConfig.imageDir, image)));
        else resolve(utility.result(202, 'Image does not exist', undefined));

    });
};
