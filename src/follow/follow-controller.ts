import express from 'express';
import followService from './follow-service';

/*
Get user's following list.

Request Param
access : string

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{user: string[]}

Response Code
101 : OK
201 : User does not exist
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
        const result = await followService.getFollowing(access);
        response.json(result);


    } catch(error) { next(error); }

};

/*
Get user's follower list.

Request Param
access : string

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{user: string[]}

Response Code
101 : OK
201 : User does not exist
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
        const result = await followService.getFollower(access);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Check if following.

Request Param
follower : string
following : string

Response JSON
{code: number, message: string, result: json}

Response JSON Result
{following: boolean}

Response Code
101 : OK
201 : User does not exist
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
        const result = await followService.getCheck(follower, following);
        response.json(result);

    } catch(error) { next(error); }

};

/*
Follow other user.

Request Header
token : string

Request Body JSON
{type: boolean, access: string}

Response JSON
{code: number, message: string}

Response Code
101 : OK
201 : User does not exist
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
        const result = await followService.post(user, access, type);
        response.json(result);

    } catch(error) { next(error); }

};

export default {
    getFollowing,
    getFollower,
    getCheck,
    post
};
