import * as mysqlManager from '../mysql-manager';
import * as followSQL from './follow-sql';

export const getFollowingList = (user: number): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const getFollowingQuery = await mysqlManager.execute(followSQL.selectFollowing(user));

            const followingList = [];
            for(const following of getFollowingQuery) followingList.push(following.access);

            resolve(followingList);

        } catch(error) { reject(error); }

    });
};

export const getFollowerList = (user: number): Promise<string[]> => {
    return new Promise(async (resolve, reject) => {

        try {

            const getFollowerQuery = await mysqlManager.execute(followSQL.selectFollower(user));

            const followerList = [];
            for(const follower of getFollowerQuery) followerList.push(follower.access);

            resolve(followerList);

        } catch(error) { reject(error); }

    });
};

export const checkFollowing = (follower: number, following: number): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {

        try {

            const checkQuery = await mysqlManager.execute(followSQL.checkFollowing(follower, following));

            if(checkQuery.length === 1) resolve(true);
            else resolve(false);

        } catch(error) { reject(error); }

    });
};

export const follow = (follower: number, following: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {

        try {

            await mysqlManager.execute(followSQL.addFollow(follower, following));

            resolve();

        } catch(error) { reject(error); }

    });
};

export const unFollow = (follower: number, following: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {

        try {

            await mysqlManager.execute(followSQL.deleteFollow(follower, following));

            resolve();

        } catch(error) { reject(error); }

    });
};
