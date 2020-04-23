import express from 'express';
import sharp from 'sharp';
import userController from './user/user-controller';

const getTime = (): string => {

    const time = new Date();

    const date = ("0" + time.getDate()).slice(-2);
    const month = ("0" + (time.getMonth() + 1)).slice(-2);
    const year = time.getFullYear();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const result = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    return result.padEnd(20);

};

const print = (log: string): void => {

    console.log(`${getTime()}| ${log}`);

};

const authChecker = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    const token = request.headers.token;
    let user = null;

    try {

        if(typeof token === 'string') {

            const tokenResult: {auth: boolean, id?: number, email?: string, name?: string} = await userController.checkToken(token);

            // auth check
            if(tokenResult.auth) user = tokenResult.id;

        }

    } catch(error) {

        print(`Auth Check Error\n${error}`);

    }

    // save user id
    response.locals.user = user;

    next();

};

const errorHandler = (error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {

    print(`Error\n${error}`);

    response.status(500).end();

};

const saveImage = (sourceImg: string, targetImg: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {

        try {

            await sharp(sourceImg)
                .resize(512, 512)
                .toFile(targetImg, (error, info) => {
                    if(error) reject(error);
                    resolve(info);
                });

        } catch(error) {

            reject(error);

        }

    });
};

export default {
    getTime,
    print,
    authChecker,
    errorHandler,
    saveImage
};
