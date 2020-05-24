import express from 'express';
import followDao from './follow-dao';
import userDao from '../user/user-dao';
import utility from '../utility';

/*
Get user's following list.

Response JSON
{user: string[]}
*/
const getFollowing = async (response: express.Response, access: string) => {

    // print log
    utility.print(`GET /user/follow/ing | access: ${access}`);

    const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

    // user exist check
    if(!accessResult.result || accessResult.id === undefined) {
        response.status(404).end();
        return;
    }

    const id = accessResult.id;

    const followingResult: string[] = await followDao.getFollowingList(id);

    response.json({ user: followingResult });

};

/*
Get user's follower list.

Response JSON
{user: string[]}
*/
const getFollower = async (response: express.Response, access: string) => {

    // print log
    utility.print(`GET /user/follow/er | access: ${access}`);

    const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

    // user exist check
    if(!accessResult.result || accessResult.id === undefined) {
        response.status(404).end();
        return;
    }

    const id = accessResult.id;

    const followerResult: string[] = await followDao.getFollowerList(id);

    response.json({ user: followerResult });

};

/*
Check if following.

Response JSON
{following: boolean}
*/
const getCheck = async (response: express.Response, follower: string, following: string) => {

    // print log
    utility.print(`GET /check | follower: ${follower} following: ${following}`);

    const followerAccessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(follower);
    const followingAccessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(following);

    // user exist check
    if(!followerAccessResult.result || followerAccessResult.id === undefined || !followingAccessResult.result || followingAccessResult.id === undefined) {
        response.status(404).end();
        return;
    }

    const followerId = followerAccessResult.id;
    const followingId = followingAccessResult.id;

    const checkResult: boolean = await followDao.checkFollowing(followerId, followingId);

    response.json({ following: checkResult });

};

/*
Follow other user.

Response JSON
{result: boolean}
*/
const post = async (response: express.Response, user: number, access: string, type: boolean) => {

    // print log
    utility.print(`POST /user/follow | user: ${user} access: ${access}`);

    const accessResult: {result: boolean, id?: number} = await userDao.getUserFromAccess(access);

    // user exist check
    if(!accessResult.result || accessResult.id === undefined) {
        response.status(404).end();
        return;
    }

    const id = accessResult.id;

    if(type) await followDao.follow(user, id);
    else await followDao.unFollow(user, id);

    response.json({ result: true });

};

export default {
    getFollowing,
    getFollower,
    getCheck,
    post
};
