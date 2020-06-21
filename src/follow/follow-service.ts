import * as followDAO from './follow-dao';
import * as userDAO from '../user/user-dao';
import * as utility from '../utility';
import { User } from '../@types/class';

/*
Get user's following list.

Response JSON Result
{user: string[]}

Response Code
101 : OK
201 : User does not exist
*/
export const getFollowing = async (access: string): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`GET /user/follow/ing | access: ${access}`);

        const user: User = await userDAO.getUserByAccess(access);

        // user exist check
        if(user === undefined) {
            resolve(utility.result(201, 'User does not exist', undefined));
            return;
        }

        const followingResult: string[] = await followDAO.getFollowingList(user.id);

        const result = {
            user: followingResult
        };

        resolve(utility.result(101, 'OK', result));

    });
};

/*
Get user's follower list.

Response JSON Result
{user: string[]}

Response Code
101 : OK
201 : User does not exist
*/
export const getFollower = async (access: string): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`GET /user/follow/er | access: ${access}`);

        const user: User = await userDAO.getUserByAccess(access);

        // user exist check
        if(user === undefined) {
            resolve(utility.result(201, 'User does not exist', undefined));
            return;
        }

        const followerResult: string[] = await followDAO.getFollowerList(user.id);

        const result = {
            user: followerResult
        };

        resolve(utility.result(101, 'OK', result));

    });
};

/*
Check if following.

Response JSON Result
{following: boolean}

Response Code
101 : OK
201 : User does not exist
*/
export const getCheck = async (followerAccess: string, followingAccess: string): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`GET /check | follower: ${followerAccess} following: ${followingAccess}`);

        const follower: User = await userDAO.getUserByAccess(followerAccess);
        const following: User = await userDAO.getUserByAccess(followingAccess);

        // user exist check
        if(follower === undefined || following === undefined) {
            resolve(utility.result(201, 'User does not exist', undefined));
            return;
        }

        const checkResult: boolean = await followDAO.checkFollowing(follower.id, following.id);

        const result = {
            following: checkResult
        };

        resolve(utility.result(101, 'OK', result));

    });
};

/*
Follow other user.

Response Code
101 : OK
201 : User does not exist
*/
export const post = async (userId: number, access: string, type: boolean): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`POST /user/follow | user: ${userId} access: ${access}`);

        const user: User = await userDAO.getUserByAccess(access);

        // user exist check
        if(user === undefined) {
            resolve(utility.result(201, 'User does not exist', undefined));
            return;
        }

        if(type) await followDAO.follow(userId, user.id);
        else await followDAO.unFollow(userId, user.id);

        resolve(utility.result(101, 'OK', undefined));

    });
};
