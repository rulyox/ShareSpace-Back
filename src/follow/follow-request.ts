import express from 'express';
import followResponse from './follow-response';

/*
Get user's following list.

Request Param
access : string

Response JSON
{user: string[]}
*/
const getFollowing = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const access = request.params.access;

        // type check
        if(access === null) {
            response.status(400).end();
            return;
        }

        // response
        await followResponse.getFollowing(response, access);

    } catch(error) { next(error); }

};

/*
Get user's follower list.

Request Param
access : string

Response JSON
{user: string[]}
*/
const getFollower = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const access = request.params.access;

        // type check
        if(access === null) {
            response.status(400).end();
            return;
        }

        // response
        await followResponse.getFollower(response, access);

    } catch(error) { next(error); }

};

/*
Check if following.

Request Param
follower : string
following : string

Response JSON
{following: boolean}
*/
const getCheck = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const follower = request.params.follower;
        const following = request.params.following;

        // type check
        if(follower === null || following === null) {
            response.status(400).end();
            return;
        }

        // response
        await followResponse.getCheck(response, follower, following);

    } catch(error) { next(error); }

};

/*
Follow other user.

Request Header
token : string

Request Body JSON
{type: boolean, access: string}

Response JSON
{result: boolean}
*/
const post = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    try {

        // parse request
        const user = response.locals.user;
        const type = request.body.type;
        const access = request.body.access;

        // auth check
        if(user === null) {
            response.status(401).end();
            return;
        }

        // type check
        if(typeof type !== 'boolean' || typeof access !== 'string') {
            response.status(400).end();
            return;
        }

        // response
        await followResponse.post(response, user, access, type);

    } catch(error) { next(error); }

};

export default {
    getFollowing,
    getFollower,
    getCheck,
    post
};
