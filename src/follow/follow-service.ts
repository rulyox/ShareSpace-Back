import followDao from './follow-dao';
import userDao from '../user/user-dao';
import utility from '../utility';

/*
Get user's following list.

Response JSON Result
{user: string[]}

Response Code
101 : OK
201 : User does not exist
*/
const getFollowing = async (access: string) => {

    // print log
    utility.print(`GET /user/follow/ing | access: ${access}`);

    const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

    // user exist check
    if(!accessResult.result || accessResult.id === undefined) return utility.result(201, 'User does not exist', undefined);

    const id = accessResult.id;

    const followingResult: string[] = await followDao.getFollowingList(id);

    const result = {
        user: followingResult
    };

    return utility.result(101, 'OK', result);

};

/*
Get user's follower list.

Response JSON Result
{user: string[]}

Response Code
101 : OK
201 : User does not exist
*/
const getFollower = async (access: string) => {

    // print log
    utility.print(`GET /user/follow/er | access: ${access}`);

    const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

    // user exist check
    if(!accessResult.result || accessResult.id === undefined) return utility.result(201, 'User does not exist', undefined);

    const id = accessResult.id;

    const followerResult: string[] = await followDao.getFollowerList(id);

    const result = {
        user: followerResult
    };

    return utility.result(101, 'OK', result);

};

/*
Check if following.

Response JSON Result
{following: boolean}

Response Code
101 : OK
201 : User does not exist
*/
const getCheck = async (follower: string, following: string) => {

    // print log
    utility.print(`GET /check | follower: ${follower} following: ${following}`);

    const followerAccessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(follower);
    const followingAccessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(following);

    // user exist check
    if(!followerAccessResult.result || followerAccessResult.id === undefined || !followingAccessResult.result || followingAccessResult.id === undefined) return utility.result(201, 'User does not exist', undefined);

    const followerId = followerAccessResult.id;
    const followingId = followingAccessResult.id;

    const checkResult: boolean = await followDao.checkFollowing(followerId, followingId);

    const result = {
        following: checkResult
    };

    return utility.result(101, 'OK', result);

};

/*
Follow other user.

Response Code
101 : OK
201 : User does not exist
*/
const post = async (user: number, access: string, type: boolean) => {

    // print log
    utility.print(`POST /user/follow | user: ${user} access: ${access}`);

    const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

    // user exist check
    if(!accessResult.result || accessResult.id === undefined) return utility.result(201, 'User does not exist', undefined);

    const id = accessResult.id;

    if(type) await followDao.follow(user, id);
    else await followDao.unFollow(user, id);

    return utility.result(101, 'OK', undefined);

};

export default {
    getFollowing,
    getFollower,
    getCheck,
    post
};
