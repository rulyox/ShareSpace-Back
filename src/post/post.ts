import { User } from '../user';

export class Post {

    private _user: User;
    private _text: string;
    private _time: string;
    private _image: string[];

    constructor(user: User, text: string, time: string, image: string[]) {
        this._user = user;
        this._text = text;
        this._time = time;
        this._image = image;
    }

    get user(): User {
        return this._user;
    }

    set user(value: User) {
        this._user = value;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    get time(): string {
        return this._time;
    }

    set time(value: string) {
        this._time = value;
    }

    get image(): string[] {
        return this._image;
    }

    set image(value: string[]) {
        this._image = value;
    }

}

export class Comment {

    private _id: number;
    private _access: string;
    private _comment: string;
    private _time: string;

    constructor(id: number, access: string, comment: string, time: string) {
        this._id = id;
        this._access = access;
        this._comment = comment;
        this._time = time;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get access(): string {
        return this._access;
    }

    set access(value: string) {
        this._access = value;
    }

    get comment(): string {
        return this._comment;
    }

    set comment(value: string) {
        this._comment = value;
    }

    get time(): string {
        return this._time;
    }

    set time(value: string) {
        this._time = value;
    }

}
