import * as followDAO from './follow-dao';
import * as userDAO from '../user/user-dao';
import * as utility from '../utility';

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

        const accessResult: {result: boolean, id?: number} = await userDAO.getUserFromAccess(access);

        // user exist check
        if(!accessResult.result || accessResult.id === undefined) {
            resolve(utility.result(201, 'User does not exist', undefined));
            return;
        }

        const id = accessResult.id;

        const followingResult: string[] = await followDAO.getFollowingList(id);

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

        const accessResult: {result: boolean, id?: number} = await userDAO.getUserFromAccess(access);

        // user exist check
        if(!accessResult.result || accessResult.id === undefined) {
            resolve(utility.result(201, 'User does not exist', undefined));
            return;
        }

        const id = accessResult.id;

        const followerResult: string[] = await followDAO.getFollowerList(id);

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
export const getCheck = async (follower: string, following: string): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`GET /check | follower: ${follower} following: ${following}`);

        const followerAccessResult: {result: boolean, id?: number} = await userDAO.getUserFromAccess(follower);
        const followingAccessResult: {result: boolean, id?: number} = await userDAO.getUserFromAccess(following);

        // user exist check
        if(!followerAccessResult.result || followerAccessResult.id === undefined || !followingAccessResult.result || followingAccessResult.id === undefined) {
            resolve(utility.result(201, 'User does not exist', undefined));
            return;
        }

        const followerId = followerAccessResult.id;
        const followingId = followingAccessResult.id;

        const checkResult: boolean = await followDAO.checkFollowing(followerId, followingId);

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
export const post = async (user: number, access: string, type: boolean): Promise<APIResult> => {
    return new Promise(async (resolve) => {

        // print log
        utility.print(`POST /user/follow | user: ${user} access: ${access}`);

        const accessResult: {result: boolean, id?: number} = await userDAO.getUserFromAccess(access);

        // user exist check
        if(!accessResult.result || accessResult.id === undefined) {
            resolve(utility.result(201, 'User does not exist', undefined));
            return;
        }

        const id = accessResult.id;

        if(type) await followDAO.follow(user, id);
        else await followDAO.unFollow(user, id);

        resolve(utility.result(101, 'OK', undefined));

    });
};
