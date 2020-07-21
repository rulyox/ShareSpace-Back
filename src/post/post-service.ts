import path from 'path';
import { User, userDAO } from '../user';
import { Post, Comment, postDAO } from '../post';
import * as utility from '../utility';
import dataConfig from '../../config/data.json';

/*
Write new post.

Response Code
101 : OK
*/
export const post = async (user: number, formData: {text: string, images: object[]}): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`POST /post | user: ${user} file: ${formData.images.length}`);

            await postDAO.writePost(user, formData.text, formData.images);

            resolve(utility.result(101, 'OK', undefined));

        } catch(error) { reject(error); }

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
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`DELETE /post | user: ${userId}`);

            const postId: number = await postDAO.getIdFromAccess(access);

            // post exist check
            if(postId === undefined) {
                resolve(utility.result(201, 'Post does not exist', undefined));
                return;
            }

            const post: Post|null = await postDAO.get(postId);

            if(post !== null) {

                if(userId === post.user.id) {

                    await postDAO.deletePost(postId);

                    resolve(utility.result(101, 'OK', undefined));

                } else {

                    resolve(utility.result(202, 'No authorization', undefined));

                }

            } else {

                resolve(utility.result(201, 'Post does not exist', undefined));

            }

        } catch(error) { reject(error); }

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
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /post/data | user: ${user} access: ${access}`);

            const postId: number = await postDAO.getIdFromAccess(access);

            // post exist check
            if(postId === undefined) {
                resolve(utility.result(201, 'Post does not exist', undefined));
                return;
            }

            const post: Post|null = await postDAO.get(postId);

            if(post !== null) {

                const result = {
                    user: post.user.access,
                    name: post.user.name,
                    profile: post.user.image,
                    text: post.text,
                    image: post.image
                };

                resolve(utility.result(101, 'OK', result));

            } else {

                resolve(utility.result(201, 'Post does not exist', undefined));

            }

        } catch(error) { reject(error); }

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
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /post/preview | user: ${user} access: ${access}`);

            const postId: number = await postDAO.getIdFromAccess(access);

            // post exist check
            if(postId === undefined) {
                resolve(utility.result(201, 'Post does not exist', undefined));
                return;
            }

            const post: Post| null = await postDAO.get(postId);

            if(post !== null) {

                // create preview image from first image
                let previewImage: string|null = null;
                if(post.image !== undefined && post.image.length > 0) previewImage = post.image[0];

                const result = {
                    user: post.user.access,
                    name: post.user.name,
                    profile: post.user.image,
                    text: post.text,
                    image: previewImage
                };

                resolve(utility.result(101, 'OK', result));

            } else {

                resolve(utility.result(201, 'Post does not exist', undefined));

            }

        } catch(error) { reject(error); }

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
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /post/feed | user: ${user}`);

            const feedData: string[] = await postDAO.getFeed(user, start, count);

            const result = {
                post: feedData
            };

            resolve(utility.result(101, 'OK', result));

        } catch(error) { reject(error); }

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
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /post/user | user: ${userId} start: ${start} count: ${count}`);

            const user: User|null = await userDAO.getByAccess(access);

            // user exist check
            if(user === null) {
                resolve(utility.result(201, 'User does not exist', undefined));
                return;
            }

            // get number of posts by user
            const postCount = await postDAO.getNumberOfPostByUser(user.id);

            // start should be 0 from postCount-1
            if(start >= 0 && start < postCount) {

                // get post list by user
                const postList: string[] = await postDAO.getPostByUser(user.id, start, count);

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

        } catch(error) { reject(error); }

    });
};

/*
Get image file.

Response
image file
*/
export const getImage = async (user: number, access: string, image: string): Promise<string|null> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /post/image | user: ${user} access: ${access} image: ${image}`);

            const postId: number = await postDAO.getIdFromAccess(access);

            // post exist check
            if(postId === undefined) {
                resolve(null);
                return;
            }

            const imageResult: boolean = await postDAO.checkImage(postId, image);

            if(imageResult) resolve(path.join(__dirname, '../../../', dataConfig.imageDir, image));
            else resolve(null);

        } catch(error) { reject(error); }

    });
};

/*
Get likes of post.

Response JSON Result
{user: string[]}

Response Code
101 : OK
201 : Post does not exist
*/
export const getLike = async (user: number, access: string): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /like | user: ${user} access: ${access}`);

            const postId: number = await postDAO.getIdFromAccess(access);

            // post exist check
            if(postId === undefined) {
                resolve(utility.result(201, 'Post does not exist', undefined));
                return;
            }

            const userList: string[] = await postDAO.getLike(postId);

            const result = {
                user: userList
            };

            resolve(utility.result(101, 'OK', result));

        } catch(error) { reject(error); }

    });
};


/*
Like post.

Response Code
101 : OK
201 : Post does not exist
*/
export const postLike = async (user: number, access: string, type: boolean): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`POST /like | user: ${user} access: ${access}`);

            const postId: number = await postDAO.getIdFromAccess(access);

            // post exist check
            if(postId === undefined) {
                resolve(utility.result(201, 'Post does not exist', undefined));
                return;
            }

            if(type) await postDAO.like(postId, user);
            else await postDAO.unLike(postId, user);

            resolve(utility.result(101, 'OK', undefined));

        } catch(error) { reject(error); }

    });
};

/*
Get comments of post.

Response Code
101 : OK
201 : Post does not exist
*/
export const getComment = async (user: number, access: string): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`GET /comment | user: ${user} access: ${access}`);

            const postId: number = await postDAO.getIdFromAccess(access);

            // post exist check
            if(postId === undefined) {
                resolve(utility.result(201, 'Post does not exist', undefined));
                return;
            }

            const getComment: Comment[] = await postDAO.getComment(postId);
            const commentList = [];

            for(const comment of getComment) {

                commentList.push({
                    id: comment.id,
                    user: comment.access,
                    comment: comment.comment,
                    time: comment.time
                });

            }

            const result = {
                comment: commentList
            };

            resolve(utility.result(101, 'OK', result));

        } catch(error) { reject(error); }

    });
};

/*
Write comment.

Response Code
101 : OK
201 : Post does not exist
*/
export const postComment = async (user: number, access: string, comment: string): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`POST /comment | user: ${user} access: ${access}`);

            const postId: number = await postDAO.getIdFromAccess(access);

            // post exist check
            if(postId === undefined) {
                resolve(utility.result(201, 'Post does not exist', undefined));
                return;
            }

            await postDAO.writeComment(postId, user, comment);

            resolve(utility.result(101, 'OK', undefined));

        } catch(error) { reject(error); }

    });
};

/*
Delete comment.

Response Code
101 : OK
*/
export const deleteComment = async (user: number, id: number): Promise<APIResult> => {
    return new Promise(async (resolve, reject) => {

        try {

            // print log
            utility.print(`DELETE /comment | user: ${user} id: ${id}`);

            await postDAO.deleteComment(id);

            resolve(utility.result(101, 'OK', undefined));

        } catch(error) { reject(error); }

    });
};
