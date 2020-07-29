import * as DB from '../mysql-manager';
import { followSQL } from '../follow';

export const getFollowingList = (user: number): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectFollowing = await DB.run(followSQL.selectFollowing(user));

            const followingList = [];
            for(const following of selectFollowing) followingList.push(following.access);

            resolve(followingList);

        } catch(error) { reject(error); }

    });
};

export const getFollowerList = (user: number): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const selectFollower = await DB.run(followSQL.selectFollower(user));

            const followerList = [];
            for(const follower of selectFollower) followerList.push(follower.access);

            resolve(followerList);

        } catch(error) { reject(error); }

    });
};

export const checkFollowing = (follower: number, following: number): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {

        try {

            const checkFollowing = await DB.run(followSQL.checkFollowing(follower, following));

            if(checkFollowing.length === 1) resolve(true);
            else resolve(false);

        } catch(error) { reject(error); }

    });
};

export const follow = (follower: number, following: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {

        try {

            await DB.run(followSQL.addFollow(follower, following));

            resolve();

        } catch(error) { reject(error); }

    });
};

export const unFollow = (follower: number, following: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {

        try {

            await DB.run(followSQL.deleteFollow(follower, following));

            resolve();

        } catch(error) { reject(error); }

    });
};
