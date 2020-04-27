import path from 'path';
import mysqlManager from '../mysql-manager';
import postSQL from './post-sql';
import utility from '../utility';
import dataConfig from '../../config/data.json';

const writePost = (user: number, text: string, imageList: any[]): Promise<number> => {
    return new Promise(async (resolve, reject) => {

        try {

            // add post to db
            const postAddQuery = await mysqlManager.execute(postSQL.add(user, text));
            const postId: number = postAddQuery.insertId;

            for(const [index, image] of Object.entries(imageList)) {

                const originalPath = image.path;
                const imageName = `${postId}_${index}.png`;

                // save image to png file
                await utility.saveImage(originalPath, path.join(__dirname, '../../../', dataConfig.imageDir, imageName));

                // add image to db
                await mysqlManager.execute(postSQL.addImage(postId, imageName));

            }

            resolve(postId);

        } catch(error) { reject(error); }

    });
};

const getNumberOfPostByUser = (user: number): Promise<number> => {
    return new Promise(async (resolve, reject) => {

        try {

            // get number of posts by user
            const postCountQuery = (await mysqlManager.execute(postSQL.selectNumberOfPostByUser(user)))[0];
            const postCount = postCountQuery.count;

            resolve(postCount);

        } catch(error) { reject(error); }

    });
};

const getPostByUser = (user: number, start: number, count: number): Promise<number[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            // get post list by user
            const postQuery: {id: number}[] = await mysqlManager.execute(postSQL.selectPostByUserInRange(user, start, count));

            // save post id to list
            const postList = [];
            for(const post of postQuery) postList.push(post.id);

            resolve(postList);

        } catch(error) { reject(error); }

    });
};

/*
Result Code
101 : OK
201 : Post does not exist
*/
const getPostData = (id: number): Promise<{result: number, user?: number, name?: string, profile?: string, text?: string, image?: string[]}> => {
    return new Promise(async (resolve, reject) => {

        try {

            // get data of a post
            const postDataQuery: {user: number, name: string, profile: string, text: string}[] = (await mysqlManager.execute(postSQL.selectPostData(id)));

            if(postDataQuery.length === 1) {

                // get images of a post
                const postImageQuery: {image: string}[] = await mysqlManager.execute(postSQL.selectPostImage(id));

                // save image file name to list
                const imageList = [];
                for(const image of postImageQuery) imageList.push(image.image);

                resolve({
                    result: 101,
                    user: postDataQuery[0].user,
                    name: postDataQuery[0].name,
                    profile: postDataQuery[0].profile,
                    text: postDataQuery[0].text,
                    image: imageList
                });

            } else { // if post does not exist

                resolve({ result: 201 });

            }

        } catch(error) { reject(error); }

    });
};

const checkImage = (post: number, image: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {

        try {

            // get data of a post
            const imageQuery: {image: string}[] = (await mysqlManager.execute(postSQL.selectImageFile(post, image)));

            if(imageQuery.length === 1) resolve(true);
            else resolve(false);

        } catch(error) { reject(error); }

    });
};

const getFeed = (user: number, start: number, count: number): Promise<number[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const feedQuery = await mysqlManager.execute(postSQL.selectFeedInRange(user, start, count));

            const postList = [];
            for(const post of feedQuery) postList.push(post.post);

            resolve(postList);

        } catch(error) { reject(error); }

    });
};

export default {
    writePost,
    getNumberOfPostByUser,
    getPostByUser,
    getPostData,
    checkImage,
    getFeed
};
