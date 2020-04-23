import express from 'express';
import formidable from 'formidable';

const parseForm = (request: express.Request): Promise<{text: string, images: object[]}> => {
    return new Promise(async (resolve, reject) => {

        try {

            const formParser = new formidable.IncomingForm();
            formParser.parse(request, function (error, fields, files) {

                if(error) {
                    reject(error);
                    return
                }

                if(typeof fields.text !== 'string') {
                    reject('FormData text is not string');
                    return;
                }

                resolve({
                    text: fields.text,
                    images: Object.values(files)
                });

            });

        } catch(error) { reject(error); }

    });
};

export default {
    parseForm
};
