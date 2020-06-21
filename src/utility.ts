import sharp from 'sharp';

export const getTime = (): string => {

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

export const print = (log: string): void => {

    console.log(`${getTime()}| ${log}`);

};

export const saveImage = (sourceImg: string, targetImg: string): Promise<any> => {
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

export const result = (code: number, message: string, result: any): APIResult => {

    return {
        code: code,
        message: message,
        result: result
    };

}
