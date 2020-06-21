import express from 'express';
import * as userDao from './user/user-dao';
import * as utility from './utility';

export const authChecker = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const token = request.headers.token;
    let user = null;

    try {

        if(typeof token === 'string') {

            const tokenResult: {auth: boolean, id?: number, email?: string, name?: string} = await userDao.checkToken(token);

            // auth check
            if(tokenResult.auth) user = tokenResult.id;

        }

    } catch(error) {

        utility.print(`Auth Check Error\n${error}`);

    }

    // save user id
    response.locals.user = user;

    next();

};

export const errorHandler = (error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {

    utility.print(`Error\n${error}`);

    response.status(500).end();

};
