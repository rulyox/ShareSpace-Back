import express from 'express';
import { User, userDAO } from './user';
import * as utility from './utility';

export const authChecker = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const token = request.headers.token;
    let userId: number|null = null;

    try {

        if(typeof token === 'string') {

            const user: User|null = await userDAO.checkToken(token);

            // auth check
            if(user !== null) userId = user.id;

        }

    } catch(error) {

        utility.print(`Auth Check Error\n${error}`);

    }

    // save user id
    response.locals.user = userId;

    next();

};

export const errorHandler = (error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {

    utility.print(`Error\n${error}`);

    response.status(500).end();

};
