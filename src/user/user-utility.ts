import crypto from 'crypto';
import serverConfig from '../../config/server.json';

const createToken = (email: string, pw: string): string => {

    const credential = {
        email: email,
        pw: pw
    };

    return encryptAES(JSON.stringify(credential));

};

const encryptAES = (plainText: string): string => {

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', serverConfig.aes, iv);
    let encryptedText = cipher.update(plainText);
    encryptedText = Buffer.concat([encryptedText, cipher.final()]);

    return iv.toString('hex') + encryptedText.toString('hex');

};

const decryptAES = (cipherText: string): string => {

    const iv = Buffer.from(cipherText.substring(0, 32), 'hex');
    const encryptedText = Buffer.from(cipherText.substring(32), 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', serverConfig.aes, iv);
    let decryptedText = decipher.update(encryptedText);
    decryptedText = Buffer.concat([decryptedText, decipher.final()]);

    return decryptedText.toString();

};

export default {
    createToken,
    encryptAES,
    decryptAES
};
