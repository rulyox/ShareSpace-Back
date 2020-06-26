import path from 'path';
import * as DB from '../mysql-manager';
import { User } from '../user';
import { Post, postSQL, postUtility } from '../post';
import * as utility from '../utility';
import dataConfig from '../../config/data.json';

export const writePost = (user: number, text: string, imageList: any[]) => {
    return new Promise(async (resolve, reject) => {

        try {

            // generate random access key
            const access: string = await postUtility.createRandomAccess();

            // add post to db
            const add = await DB.execute(postSQL.add(access, user, text));
            const postId: number = add.insertId;

            for(const [index, image] of Object.entries(imageList)) {

                const originalPath = image.path;
                const imageName = `${access}_${index}.png`;

                // save image to png file
                await utility.saveImage(originalPath, path.join(__dirname, '../../../', dataConfig.imageDir, imageName));

                // add image to db
                await DB.execute(postSQL.addImage(postId, imageName));

            }

            resolve();

        } catch(error) { reject(error); }

    });
};

export const deletePost = (id: number) => {
    return new Promise(async (resolve, reject) => {

        try {

            await DB.execute(postSQL.deleteById(id));

            resolve();

        } catch(error) { reject(error); }

    });
};

export const getPostData = (id: number): Promise<Post|null> => {
    return new Promise(async (resolve, reject) => {

        try {

            // get data of a post
            const selectById: {user: number, access: string, email: string, name: string, profile: string, text: string, time: string}[] = await DB.execute(postSQL.selectById(id));

            if(selectById.length === 1) {

                // get images of a post
                const selectPostImage: {image: string}[] = await DB.execute(postSQL.selectPostImage(id));

                // save image file name to list
                const imageList = [];
                for(const image of selectPostImage) imageList.push(image.image);

                const postData = selectById[0];
                const user = new User(postData.user, postData.access, postData.email, postData.name, postData.profile);
                const post = new Post(user, postData.text, postData.time, imageList);

                resolve(post);

            } else { // if post does not exist

                resolve(null);

            }

        } catch(error) { reject(error); }

    });
};

export const getPostFromAccess = (access: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectIdByAccess = (await DB.execute(postSQL.selectIdByAccess(access)));

            if(selectIdByAccess.length === 0) { // if id does not exist

                resolve(undefined);

            } else {

                const postData = selectIdByAccess[0];

                resolve(postData.id);

            }

        } catch(error) { reject(error); }

    });
};

export const getFeed = (user: number, start: number, count: number): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectFeedInRange = await DB.execute(postSQL.selectFeedInRange(user, start, count));

            const postList = [];
            for(const post of selectFeedInRange) postList.push(post.access);

            resolve(postList);

        } catch(error) { reject(error); }

    });
};

export const getNumberOfPostByUser = (user: number): Promise<number> => {
    return new Promise(async (resolve, reject) => {

        try {

            // get number of posts by user
            const selectNumberOfPostByUser = await DB.execute(postSQL.selectNumberOfPostByUser(user));
            const postCount = selectNumberOfPostByUser[0].count;

            resolve(postCount);

        } catch(error) { reject(error); }

    });
};

export const getPostByUser = (user: number, start: number, count: number): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            // get post list by user
            const selectPostByUserInRange: {access: string}[] = await DB.execute(postSQL.selectPostByUserInRange(user, start, count));

            // save post id to list
            const postList = [];
            for(const post of selectPostByUserInRange) postList.push(post.access);

            resolve(postList);

        } catch(error) { reject(error); }

    });
};

export const checkImage = (post: number, image: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {

        try {

            // get data of a post
            const selectImageFile: {image: string}[] = (await DB.execute(postSQL.selectImageFile(post, image)));

            if(selectImageFile.length === 1) resolve(true);
            else resolve(false);

        } catch(error) { reject(error); }

    });
};
